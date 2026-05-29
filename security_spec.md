# Security Specification & Threat Model
## Bharat Connect (Call & Chat Integration)

### 1. Data Invariants
1. **Parent-Derived Access Control (Master Gate):** A user cannot fetch, send, or modify messages in a Chat Room unless their profile UUID resides within that Chat Room's `members` collection list.
2. **Sender Integrity Validation:** For any message submission, the payload's `senderId` field must exactly match the authenticated user's `request.auth.uid`. No user can masquerade as another.
3. **Immutability Clauses:** Crucial administrative fields such as `createdAt`, `hostId`, user `uid`, and document `id` are marked as write-once, immutable properties. Under no condition can they be modified during updates.
4. **Input Size Constancy:** Strings such as names, status messages, text logs, and document paths are bounded by size limits to mitigate Denial-of-Wallet buffer-poisoning vectors.

---

### 2. The "Dirty Dozen" Poison Payloads

The following payloads represent malicious requests targeting our collection structures, which must be rejected with `PERMISSION_DENIED`.

#### User Profile Collection vulnerabilities
1. **ID Spoofing (Identity Theft):** Authenticated user `attacker_uid` attempts to write profile settings under document `target_user_uid`.
2. **Self-Elevated Custom Privilege:** Attacker attempts to inject custom parameter `"isAdmin": true` or `"role": "admin"`.
3. **Payload Bloat Denial-of-Wallet:** Attempting to inject a 10MB string into the `avatarUrl` field.
4. **Status Shortcutting:** Tampering with `onlineStatus` using an unapproved enum such as `"onlineStatus": "hacking-into-server"`.

#### Chat Room Vulnerabilities
5. **Unauthorized Group Eavesdropping:** User `attacker_uid` tries to update `members` list on chat `secure_chat_101` where they are not a member.
6. **Room Hijacking / Identity Tampering:** Attempt to update a chat's unique identification `id` attribute.
7. **Phantom Membership Creation:** Attempting to spawn a message within room `vip_lobby` where the target user is not part of the `members` schema.

#### Chat Messages Vulnerabilities
8. **Impersonated Sender Messaging:** Attacker `attacker_uid` submits chat message under nested collection listing `senderId: "victim_uid"`.
9. **Unauthorized Reaction Injection:** User `attacker_uid` tries to modify the `text` attribute of a victim's message while pretending to only update the `reactions` element.
10. **Global Search Query Leak:** Attempt to list *all* messages of all chats globally (`db.collectionGroup("messages")`) without restricting search boundaries via `resource.data.senderId` or relative chat room access.

#### Call History Vulnerabilities
11. **Spoofed Host Session Log:** Creating a finished call history log where `hostId` is set to another user without their approval.
12. **Post-Terminal Outcome Mutation:** Attempting to alter the finished `durationSeconds` or standard state of a completed call history item after it was already logged.

---

### 3. Test Assertion Specifications
Our system contains high-grade code gates verifying that each of the items listed above produces correct, airtight rejections, safeguarding student, startup, and user data. This is documented by our architectural layout which guides developers in assembling security testing targets correctly.
