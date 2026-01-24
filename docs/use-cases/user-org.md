# User & Organization Management Use Cases

This document covers use cases related to user identity and multi-tenant organization management.

**Primary Actors:** Global User, Org Admin, Org Owner

[Back to Use Cases Overview](../use-cases.md)

---

## Table of Contents

1. [UC-00a: User Registration](#uc-00a-user-registration)
2. [UC-00b: User Login](#uc-00b-user-login)
3. [UC-00c: Create Organization](#uc-00c-create-organization)
4. [UC-00d: Switch Organization](#uc-00d-switch-organization)
5. [UC-00e: Invite User to Organization](#uc-00e-invite-user-to-organization)
6. [UC-00f: Accept Organization Invitation](#uc-00f-accept-organization-invitation)
7. [UC-00g: Update User Role](#uc-00g-update-user-role)
8. [UC-00h: Remove User from Organization](#uc-00h-remove-user-from-organization)

---

## UC-00a: User Registration

**Description:** Create a new user account in the system.

**Primary Actor:** Global User (New)

**Preconditions:**
- User does not have an existing account

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | User | Navigates to registration page |
| 2 | User | Enters email address |
| 3 | System | Validates email is unique |
| 4 | User | Enters full name |
| 5 | User | Sets password (meets complexity requirements) |
| 6 | User | Confirms password |
| 7 | User | Clicks Register |
| 8 | System | Creates Global User record |
| 9 | System | Sends verification email |
| 10 | User | Clicks verification link in email |
| 11 | System | Marks email as verified |

**Alternate Flows:**

| Alt | Condition | Action |
|-----|-----------|--------|
| 3a | Email already exists | System prompts to login or reset password |
| 5a | Password too weak | System shows password requirements |
| 10a | Verification link expired | User requests new verification email |

**Postconditions:**
- Global User account created
- User can login but has no organization access yet

---

## UC-00b: User Login

**Description:** Authenticate user and provide access to their organizations.

**Primary Actor:** Global User

**Preconditions:**
- User has an existing account

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | User | Navigates to login page |
| 2 | User | Enters email and password |
| 3 | User | Clicks Login |
| 4 | System | Validates credentials |
| 5 | System | Fetches user's organization memberships |
| 6 | System | Auto-selects default organization (or last used) |
| 7 | System | Returns user info, organizations list, and auth token |
| 8 | System | Redirects to dashboard |

**Alternate Flows:**

| Alt | Condition | Action |
|-----|-----------|--------|
| 4a | Invalid credentials | System shows error, allows retry |
| 4b | Account locked | System prompts to contact admin |
| 5a | No organizations | System prompts to create or join organization |
| 6a | Multiple orgs, no default | System shows organization selector |

**Postconditions:**
- User authenticated
- Active organization context established
- Session created

---

## UC-00c: Create Organization

**Description:** Create a new organization (cold storage facility).

**Primary Actor:** Global User (Authenticated)

**Preconditions:**
- User is logged in

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | User | Clicks "Create Organization" |
| 2 | System | Displays organization creation form |
| 3 | User | Enters organization name |
| 4 | User | Enters location details (city, state) |
| 5 | User | Enters contact information (optional) |
| 6 | User | Enters GST number (optional) |
| 7 | User | Clicks Create |
| 8 | System | Generates unique slug |
| 9 | System | Creates Organization record with TRIAL status |
| 10 | System | Creates Membership with OWNER role |
| 11 | System | Initializes default master data (commodities, rooms) |
| 12 | System | Sets as user's current organization |
| 13 | System | Redirects to organization dashboard |

**Postconditions:**
- Organization created
- User is Owner of the organization
- Default data initialized
- Organization context switched

---

## UC-00d: Switch Organization

**Description:** Change the active organization context.

**Primary Actor:** Global User

**Preconditions:**
- User is logged in
- User belongs to multiple organizations

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | User | Clicks organization switcher in header |
| 2 | System | Displays list of user's organizations |
| 3 | User | Selects different organization |
| 4 | System | Validates user has active membership |
| 5 | System | Updates current organization context |
| 6 | System | Clears cached data for previous organization |
| 7 | System | Loads dashboard for new organization |

**Business Rules:**
- Only organizations with ACTIVE membership status are shown
- Current organization is highlighted in the list

**Postconditions:**
- Active organization changed
- All subsequent API calls use new organization context
- UI reflects new organization data

---

## UC-00e: Invite User to Organization

**Description:** Invite a new or existing user to join the organization.

**Primary Actor:** Org Admin / Org Owner

**Preconditions:**
- Actor has Admin or Owner role in the organization

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Admin | Navigates to Organization Settings > Members |
| 2 | Admin | Clicks "Invite Member" |
| 3 | System | Displays invitation form |
| 4 | Admin | Enters invitee's email address |
| 5 | Admin | Selects role (Operator, Accountant, Manager, etc.) |
| 6 | Admin | Enters optional personal message |
| 7 | Admin | Clicks Send Invitation |
| 8 | System | Checks if email exists in Global Users |

**Flow Branch A - Existing User:**

| Step | Actor | Action |
|------|-------|--------|
| 9a | System | Creates Membership with ACTIVE status |
| 10a | System | Sends notification email |
| 11a | System | User sees new org in their switcher immediately |

**Flow Branch B - New User:**

| Step | Actor | Action |
|------|-------|--------|
| 9b | System | Creates invitation record with token |
| 10b | System | Sends invitation email with signup link |
| 11b | Invitee | Clicks link and completes UC-00f |

**Security Constraints:**
- Users cannot invite themselves
- Cannot invite someone already in the organization
- Invitation tokens expire after 7 days

**Postconditions:**
- For existing users: Membership created, user can access organization
- For new users: Invitation pending, email sent

---

## UC-00f: Accept Organization Invitation

**Description:** New user accepts invitation and joins organization.

**Primary Actor:** Global User (New or Existing)

**Preconditions:**
- Valid invitation exists
- Invitation not expired

**Main Flow (New User):**

| Step | Actor | Action |
|------|-------|--------|
| 1 | User | Clicks invitation link in email |
| 2 | System | Validates invitation token |
| 3 | System | Displays registration form with email pre-filled |
| 4 | User | Enters full name and sets password |
| 5 | User | Clicks Join |
| 6 | System | Creates Global User record |
| 7 | System | Creates Membership with specified role |
| 8 | System | Marks invitation as used |
| 9 | System | Logs user in and sets organization context |

**Main Flow (Existing User - not logged in):**

| Step | Actor | Action |
|------|-------|--------|
| 1 | User | Clicks invitation link in email |
| 2 | System | Detects existing account, prompts login |
| 3 | User | Logs in |
| 4 | System | Creates Membership with specified role |
| 5 | System | Sets new organization as active |

**Alternate Flows:**

| Alt | Condition | Action |
|-----|-----------|--------|
| 2a | Token expired | System shows error, prompts to request new invite |
| 2b | Token already used | System shows membership already exists |

**Postconditions:**
- User account exists
- Membership created with assigned role
- User can access the organization

---

## UC-00g: Update User Role

**Description:** Change a user's role within the organization.

**Primary Actor:** Org Admin / Org Owner

**Preconditions:**
- Actor has Admin or Owner role
- Target user is a member of the organization

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Admin | Navigates to Organization Settings > Members |
| 2 | Admin | Locates user in members list |
| 3 | Admin | Clicks Edit on the user row |
| 4 | System | Displays role selection |
| 5 | Admin | Selects new role |
| 6 | Admin | Clicks Save |
| 7 | System | Updates Membership role |
| 8 | System | Logs role change in audit trail |

**Business Rules:**
- Cannot change Owner's role (ownership transfer is separate)
- Admin cannot promote to Owner
- Cannot demote yourself

**Postconditions:**
- User's role updated
- New permissions effective immediately

---

## UC-00h: Remove User from Organization

**Description:** Remove a user's access to the organization.

**Primary Actor:** Org Admin / Org Owner

**Preconditions:**
- Actor has Admin or Owner role
- Target user is a member of the organization

**Main Flow:**

| Step | Actor | Action |
|------|-------|--------|
| 1 | Admin | Navigates to Organization Settings > Members |
| 2 | Admin | Locates user in members list |
| 3 | Admin | Clicks Remove on the user row |
| 4 | System | Prompts for confirmation |
| 5 | Admin | Confirms removal |
| 6 | System | Deletes Membership record |
| 7 | System | Logs removal in audit trail |
| 8 | System | Notifies user via email (optional) |

**Business Rules:**
- Cannot remove the Owner
- Cannot remove yourself
- If removed user is currently in the organization, they are forced to switch

**Postconditions:**
- Membership deleted
- User loses access to organization
- User's Global User account remains intact

---

**Related Entities:** Global User, Organization, Membership

[Back to Use Cases Overview](../use-cases.md)
