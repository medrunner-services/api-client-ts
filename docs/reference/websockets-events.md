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

### ChatMessageUpdate

Triggers when a chat message is updated.

Returns a <TypeLink name="ChatMessage" /> object.

### TeamCreate

Triggers when a team is created.

Returns a <TypeLink name="MedrunnerTeam" /> object.

### TeamUpdate

Triggers when a team is updated.

Returns an <TypeLink name="MedrunnerTeam" /> object.

### TeamDelete

Triggers when a team is deleted.

Returns an <TypeLink name="MedrunnerTeam" /> object.

### OrgSettingsUpdate

Triggers when org settings are updated.

Returns a <TypeLink name="OrgSettings" /> object that has a <TypeLink name="PublicOrgSettings" /> and, if the user is a staff member, a <TypeLink name="StaffOrgSettings" /> .

### DeploymentCreate

Triggers when a new version of the portals is available.

Returns a <TypeLink name="Deployment" /> object.
