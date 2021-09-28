package org.orcid.memberportal.service.assertion.domain.utils;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.orcid.memberportal.service.assertion.domain.Assertion;
import org.orcid.memberportal.service.assertion.domain.OrcidRecord;
import org.orcid.memberportal.service.assertion.domain.enumeration.AssertionStatus;

public class AssertionUtils {
    private static final String GRID_BASE_URL = "https://www.grid.ac/";
    private static final String GRID_BASE_URL_INSTITUTES = "https://www.grid.ac/institutes/";
    private static final String GRID_BASE_URL_ALT = "https://grid.ac/";
    private static final String GRID_BASE_URL_INSTITUTES_ALT = "https://grid.ac/institutes/";

    public static String getAssertionStatus(Assertion assertion, OrcidRecord orcidRecord) {
        if (orcidRecord.getRevokedDate(assertion.getSalesforceId()) != null) {
            return AssertionStatus.USER_REVOKED_ACCESS.name();
        }
        if (orcidRecord.getDeniedDate(assertion.getSalesforceId()) != null) {
            return AssertionStatus.USER_DENIED_ACCESS.name();
        }
        
        if (assertion.getOrcidError() != null && !assertionModifiedSinceLastSyncAttempt(assertion)) {
            return getErrorStatus(assertion);
        }

        if (assertion.getDeletedFromORCID() != null) {
            return AssertionStatus.DELETED_IN_ORCID.name();
        }

        if (assertionModifiedSinceLastSyncAttempt(assertion)) {
            return AssertionStatus.PENDING_RETRY.name();
        }

        if (StringUtils.isBlank(assertion.getPutCode())) {
            return AssertionStatus.PENDING.name();
        }

        return AssertionStatus.IN_ORCID.name();
    }

    private static String getErrorStatus(Assertion assertion) {
        JSONObject json = new JSONObject(assertion.getOrcidError());
        int statusCode = json.getInt("statusCode");
        String errorMessage = json.getString("error");
        switch (statusCode) {
        case 404:
            return AssertionStatus.USER_DELETED_FROM_ORCID.name();
        case 401:
            return AssertionStatus.USER_REVOKED_ACCESS.name();
        case 400:
            if (errorMessage.contains("invalid_scope")) {
                return AssertionStatus.USER_REVOKED_ACCESS.name();
            } else {
                if (!StringUtils.isBlank(assertion.getPutCode())) {
                    return AssertionStatus.ERROR_UPDATING_TO_ORCID.name();
                } else {
                    return AssertionStatus.ERROR_ADDING_TO_ORCID.name();
                }
            }
        default:
            if (!StringUtils.isBlank(assertion.getPutCode())) {
                return AssertionStatus.ERROR_UPDATING_TO_ORCID.name();
            } else {
                return AssertionStatus.ERROR_ADDING_TO_ORCID.name();
            }
        }
    }

    private static boolean assertionModifiedSinceLastSyncAttempt(Assertion assertion) {
        return assertion.getModified() != null && assertion.getLastSyncAttempt() != null && assertion.getModified().isAfter(assertion.getLastSyncAttempt());
    }

    public static String stripGridURL(String gridIdentifier) {
        if (!StringUtils.isBlank(gridIdentifier)) {
            if (gridIdentifier.startsWith(GRID_BASE_URL_INSTITUTES)) {
                gridIdentifier = gridIdentifier.substring(GRID_BASE_URL_INSTITUTES.length());
            } else if (gridIdentifier.startsWith(GRID_BASE_URL)) {
                gridIdentifier = gridIdentifier.substring(GRID_BASE_URL.length());
            } else if (gridIdentifier.startsWith(GRID_BASE_URL_INSTITUTES_ALT)) {
                gridIdentifier = gridIdentifier.substring(GRID_BASE_URL_INSTITUTES_ALT.length());
            } else if (gridIdentifier.startsWith(GRID_BASE_URL_ALT)) {
                gridIdentifier = gridIdentifier.substring(GRID_BASE_URL_ALT.length());
            }
        }
        return gridIdentifier;
    }

}