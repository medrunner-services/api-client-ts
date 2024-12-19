# List of available WebSockets events

[[toc]]

### PersonUpdate

Triggers when the current user is updated.

Returns a <TypeLink name="Person" /> object.

### EmergencyCreate

Triggers when an emergency is created.

Returns an <TypeLink name="Emergency" /> object.

### EmergencyUpdate

Triggers when an emergency is updated.

Returns an <TypeLink name="Emergency" /> object.

### ChatMessageCreate

Triggers when a chat message is added to an emergency where the user participates.

Returns a <TypeLink name="ChatMessage" /> object.

### OrgSettingsUpdate

Triggers when a org settings are updated.

Returns a <TypeLink name="OrgSettings" /> object that has a <TypeLink name="PublicOrgSettings" /> and, if the user is a staff member, a <TypeLink name="StaffOrgSettings" /> .
