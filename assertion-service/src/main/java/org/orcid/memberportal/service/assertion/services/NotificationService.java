package org.orcid.memberportal.service.assertion.services;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;

import org.orcid.jaxb.model.v3.release.notification.NotificationType;
import org.orcid.jaxb.model.v3.release.notification.permission.AuthorizationUrl;
import org.orcid.jaxb.model.v3.release.notification.permission.Item;
import org.orcid.jaxb.model.v3.release.notification.permission.ItemType;
import org.orcid.jaxb.model.v3.release.notification.permission.Items;
import org.orcid.jaxb.model.v3.release.notification.permission.NotificationPermission;
import org.orcid.memberportal.service.assertion.client.OrcidAPIClient;
import org.orcid.memberportal.service.assertion.domain.Assertion;
import org.orcid.memberportal.service.assertion.domain.SendNotificationsRequest;
import org.orcid.memberportal.service.assertion.domain.enumeration.AssertionStatus;
import org.orcid.memberportal.service.assertion.repository.AssertionRepository;
import org.orcid.memberportal.service.assertion.repository.SendNotificationsRequestRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    
    private static final Logger LOG = LoggerFactory.getLogger(NotificationService.class);

    @Autowired
    private AssertionRepository assertionRepository;
    
    @Autowired
    private OrcidRecordService orcidRecordService;
    
    @Autowired
    private MessageSource messageSource;

    @Autowired
    private OrcidAPIClient orcidApiClient;
    
    @Autowired
    private SendNotificationsRequestRepository sendNotificationsRequestRepository;
    
    public boolean requestInProgress(String salesforceId) {
        return findActiveRequestBySalesforceId(salesforceId) != null;
    }

    public void createSendNotificationsRequest(String userEmail, String salesforceId) {
        if (findActiveRequestBySalesforceId(salesforceId) != null) {
            throw new RuntimeException("Send notifications request already active for " + salesforceId);
        }
        
        SendNotificationsRequest request = new SendNotificationsRequest();
        request.setEmail(userEmail);
        request.setSalesforceId(salesforceId);
        request.setDateRequested(Instant.now());
        sendNotificationsRequestRepository.insert(request);
    }
    
    public void sendPermissionLinkNotifications() {
        List<SendNotificationsRequest> requests = sendNotificationsRequestRepository.findActiveRequests();
        requests.forEach(r -> {
            processRequest(r);
            markRequestCompleted(r);
        });
    }
    
    private void markRequestCompleted(SendNotificationsRequest request) {
        LOG.info("Marking SendNotificationsRequest from user {} (salesforce ID {}) as complete", request.getEmail(), request.getSalesforceId());
        request.setDateCompleted(Instant.now());
        sendNotificationsRequestRepository.save(request);
    }
    
    private void processRequest(SendNotificationsRequest request) {
        Iterator<String> emailsWithNotificationsRequested = assertionRepository.findDistinctEmailsWithNotificationRequested(request.getSalesforceId());
        emailsWithNotificationsRequested.forEachRemaining(e -> findAssertionsAndAttemptSend(e, request.getSalesforceId()));
    }

    private void findAssertionsAndAttemptSend(String email, String salesforceId) {
        List<Assertion> allAssertionsForEmailAndMember = assertionRepository.findByEmailAndSalesforceIdAndStatus(email, salesforceId,
                AssertionStatus.NOTIFICATION_REQUESTED.name());
        try {
            String orcidId = orcidApiClient.getOrcidIdForEmail(email);
            if (orcidId == null) {
                allAssertionsForEmailAndMember.forEach(a -> {
                    a.setStatus(AssertionStatus.PENDING.name());
                    assertionRepository.save(a);
                });
            } else {
                NotificationPermission notification = getPermissionLinkNotification(allAssertionsForEmailAndMember, email, salesforceId);
                orcidApiClient.postNotification(notification, orcidId);
                allAssertionsForEmailAndMember.forEach(a -> {
                    a.setStatus(AssertionStatus.NOTIFICATION_SENT.name());
                    a.setNotificationSent(Instant.now());
                    assertionRepository.save(a);
                });
            }
        } catch (Exception e) {
            LOG.warn("Error sending notification to {} on behalf of {}", email, salesforceId);
            allAssertionsForEmailAndMember.forEach(a -> {
                a.setStatus(AssertionStatus.NOTIFICATION_FAILED.name());
                assertionRepository.save(a);
            });
        }
    }

    private NotificationPermission getPermissionLinkNotification(List<Assertion> assertions, String email, String salesforceId) {
        String orgName = assertions.get(0).getOrgName(); // take org name from first assertion
        NotificationPermission notificationPermission = new NotificationPermission();
        notificationPermission.setNotificationIntro(messageSource.getMessage("assertion.notifications.intro", null, Locale.getDefault()));
        notificationPermission.setNotificationSubject(messageSource.getMessage("assertion.notifications.subject", new Object[] { orgName }, Locale.getDefault()));
        notificationPermission.setNotificationType(NotificationType.PERMISSION);
        notificationPermission.setAuthorizationUrl(new AuthorizationUrl(orcidRecordService.generateLinkForEmailAndSalesforceId(email, salesforceId)));
        

        List<Item> items = new ArrayList<>();
        assertions.forEach(a -> {
            Item item = new Item();
            item.setItemName(a.getOrgName() + " : " + a.getRoleTitle());

            switch (a.getAffiliationSection()) {
            case DISTINCTION:
                item.setItemType(ItemType.DISTINCTION);
                break;
            case EDUCATION:
                item.setItemType(ItemType.EDUCATION);
                break;
            case EMPLOYMENT:
                item.setItemType(ItemType.EMPLOYMENT);
                break;
            case INVITED_POSITION:
                item.setItemType(ItemType.INVITED_POSITION);
                break;
            case MEMBERSHIP:
                item.setItemType(ItemType.MEMBERSHIP);
                break;
            case QUALIFICATION:
                item.setItemType(ItemType.QUALIFICATION);
                break;
            case SERVICE:
                item.setItemType(ItemType.SERVICE);
                break;
            default:
                throw new IllegalArgumentException("Invalid item type found");
            }
            items.add(item);
        });

        notificationPermission.setItems(new Items(items));
        return notificationPermission;
    }
    
    private SendNotificationsRequest findActiveRequestBySalesforceId(String salesforceId) {
        List<SendNotificationsRequest> requests = sendNotificationsRequestRepository.findActiveRequestBySalesforceId(salesforceId);
        assert requests.size() <= 1;
        return requests.size() == 1 ? requests.get(0) : null;
    }
    
}