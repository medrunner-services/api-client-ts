// Generated from the API contracts. Do not edit.
export const routes = [
  {
    "path": "/Team",
    "method": "GET",
    "responses": {
      "200": "contract0"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Team",
    "method": "POST",
    "responses": {
      "201": "contract0"
    },
    "request": "contract1",
    "requestRequired": true
  },
  {
    "path": "/Team/active",
    "method": "GET",
    "responses": {
      "200": "contract2"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Team/dispatch",
    "method": "POST",
    "responses": {
      "201": "contract0"
    },
    "request": "contract3",
    "requestRequired": true
  },
  {
    "path": "/Team/join/request",
    "method": "POST",
    "responses": {
      "200": "contract0"
    },
    "request": "contract4",
    "requestRequired": true
  },
  {
    "path": "/Team/join/withdraw",
    "method": "POST",
    "responses": {
      "200": null
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Team/join/accept",
    "method": "POST",
    "responses": {
      "200": "contract0"
    },
    "request": "contract5",
    "requestRequired": true
  },
  {
    "path": "/Team/join/deny",
    "method": "POST",
    "responses": {
      "200": null
    },
    "request": "contract6",
    "requestRequired": true
  },
  {
    "path": "/Team/dispatch/join/accept",
    "method": "POST",
    "responses": {
      "200": "contract0"
    },
    "request": "contract7",
    "requestRequired": true
  },
  {
    "path": "/Team/dispatch/join/deny",
    "method": "POST",
    "responses": {
      "200": "contract0"
    },
    "request": "contract8",
    "requestRequired": true
  },
  {
    "path": "/Team/add",
    "method": "POST",
    "responses": {
      "200": "contract0"
    },
    "request": "contract9",
    "requestRequired": true
  },
  {
    "path": "/Team/dispatch/add",
    "method": "POST",
    "responses": {
      "200": "contract0"
    },
    "request": "contract10",
    "requestRequired": true
  },
  {
    "path": "/Team/leave",
    "method": "POST",
    "responses": {
      "200": null
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Team/dispatch/order",
    "method": "POST",
    "responses": {
      "200": null
    },
    "request": "contract11",
    "requestRequired": true
  },
  {
    "path": "/Team/dispatch/split",
    "method": "POST",
    "responses": {
      "200": "contract12"
    },
    "request": "contract13",
    "requestRequired": true
  },
  {
    "path": "/Stats/monthly",
    "method": "GET",
    "responses": {
      "200": "contract15"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Stats/monthly/leaders",
    "method": "GET",
    "responses": {
      "200": "contract16"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Stats/monthly/top",
    "method": "GET",
    "responses": {
      "200": "contract15"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Stats/teammates",
    "method": "GET",
    "responses": {
      "200": "contract17"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Staff",
    "method": "GET",
    "responses": {
      "200": "contract18"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Staff/history",
    "method": "GET",
    "responses": {
      "200": "contract19"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Staff/recruit",
    "method": "POST",
    "responses": {
      "201": "contract18"
    },
    "request": "contract20",
    "requestRequired": true
  },
  {
    "path": "/Staff/reinstate",
    "method": "POST",
    "responses": {
      "200": "contract18"
    },
    "request": "contract21",
    "requestRequired": true
  },
  {
    "path": "/Staff/profile/pronouns",
    "method": "POST",
    "responses": {
      "200": "contract18"
    },
    "request": "contract22",
    "requestRequired": true
  },
  {
    "path": "/Staff/activeClass",
    "method": "POST",
    "responses": {
      "200": null
    },
    "request": "contract23",
    "requestRequired": true
  },
  {
    "path": "/Staff/settings/staffPortal",
    "method": "PUT",
    "responses": {
      "200": "contract18"
    },
    "request": "contract24",
    "requestRequired": true
  },
  {
    "path": "/Staff/meta/medals",
    "method": "GET",
    "responses": {
      "200": "contract32"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Code/redeemed",
    "method": "GET",
    "responses": {
      "200": "contract33"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Code/bulk",
    "method": "POST",
    "responses": {
      "200": "contract34"
    },
    "request": "contract35",
    "requestRequired": true
  },
  {
    "path": "/OrgSettings/public",
    "method": "GET",
    "responses": {
      "200": "contract36"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/OrgSettings/staff",
    "method": "GET",
    "responses": {
      "200": "contract37"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/OrgSettings/public/status",
    "method": "PUT",
    "responses": {
      "200": "contract38"
    },
    "request": "contract39",
    "requestRequired": true
  },
  {
    "path": "/OrgSettings/public/emergenciesEnabled",
    "method": "PUT",
    "responses": {
      "200": "contract38"
    },
    "request": "contract40",
    "requestRequired": true
  },
  {
    "path": "/OrgSettings/public/anonymousAlertsEnabled",
    "method": "PUT",
    "responses": {
      "200": "contract38"
    },
    "request": "contract41",
    "requestRequired": true
  },
  {
    "path": "/OrgSettings/public/motd",
    "method": "PUT",
    "responses": {
      "200": "contract38"
    },
    "request": "contract42",
    "requestRequired": true
  },
  {
    "path": "/OrgSettings/public/locations",
    "method": "PUT",
    "responses": {
      "200": "contract38"
    },
    "request": "contract43",
    "requestRequired": true
  },
  {
    "path": "/OrgSettings/public/locationTypes",
    "method": "PUT",
    "responses": {
      "200": "contract38"
    },
    "request": "contract44",
    "requestRequired": true
  },
  {
    "path": "/OrgSettings/public/registrationEnabled",
    "method": "PUT",
    "responses": {
      "200": "contract38"
    },
    "request": "contract45",
    "requestRequired": true
  },
  {
    "path": "/OrgSettings/staff/motd",
    "method": "PUT",
    "responses": {
      "200": "contract38"
    },
    "request": "contract42",
    "requestRequired": true
  },
  {
    "path": "/OrgSettings/staff/beaconsEnabled",
    "method": "PUT",
    "responses": {
      "200": "contract38"
    },
    "request": "contract46",
    "requestRequired": true
  },
  {
    "path": "/OrgSettings/staff/certifications/basicCertificationEnabled",
    "method": "PUT",
    "responses": {
      "200": "contract38"
    },
    "request": "contract47",
    "requestRequired": true
  },
  {
    "path": "/OrgSettings/staff/training/registrationCutoffWindow",
    "method": "PUT",
    "responses": {
      "200": "contract38"
    },
    "request": "contract48",
    "requestRequired": true
  },
  {
    "path": "/OrgSettings/staff/team/alertMaxSize",
    "method": "PUT",
    "responses": {
      "200": "contract38"
    },
    "request": "contract49",
    "requestRequired": true
  },
  {
    "path": "/OrgSettings/staff/team/beaconMaxSize",
    "method": "PUT",
    "responses": {
      "200": "contract38"
    },
    "request": "contract50",
    "requestRequired": true
  },
  {
    "path": "/OrgSettings/staff/team/trainingMaxSize",
    "method": "PUT",
    "responses": {
      "200": "contract38"
    },
    "request": "contract51",
    "requestRequired": true
  },
  {
    "path": "/OrgSettings/staff/team/enforceHardCap",
    "method": "PUT",
    "responses": {
      "200": "contract38"
    },
    "request": "contract52",
    "requestRequired": true
  },
  {
    "path": "/OrgSettings/staff/team/enforceTeams",
    "method": "PUT",
    "responses": {
      "200": "contract38"
    },
    "request": "contract53",
    "requestRequired": true
  },
  {
    "path": "/OrgSettings/staff/team/autoOrder",
    "method": "PUT",
    "responses": {
      "200": "contract38"
    },
    "request": "contract54",
    "requestRequired": true
  },
  {
    "path": "/OrgSettings/staff/team/requiredCertifications",
    "method": "PUT",
    "responses": {
      "200": "contract38"
    },
    "request": "contract55",
    "requestRequired": true
  },
  {
    "path": "/OrgSettings/staff/ships",
    "method": "PUT",
    "responses": {
      "200": "contract38"
    },
    "request": "contract56",
    "requestRequired": true
  },
  {
    "path": "/OrgSettings/staff/units",
    "method": "PUT",
    "responses": {
      "200": "contract38"
    },
    "request": "contract57",
    "requestRequired": true
  },
  {
    "path": "/Emergency/bulk",
    "method": "GET",
    "responses": {
      "200": "contract59"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Emergency/active",
    "method": "GET",
    "responses": {
      "200": "contract60"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Emergency/complete",
    "method": "GET",
    "responses": {
      "200": "contract60"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Emergency/client",
    "method": "GET",
    "responses": {
      "200": "contract60"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Emergency/responder",
    "method": "GET",
    "responses": {
      "200": "contract60"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Emergency",
    "method": "POST",
    "responses": {
      "201": "contract58"
    },
    "request": "contract61",
    "requestRequired": true
  },
  {
    "path": "/Emergency/beacon",
    "method": "POST",
    "responses": {
      "201": "contract58"
    },
    "request": "contract62",
    "requestRequired": true
  },
  {
    "path": "/Emergency/evaluation",
    "method": "POST",
    "responses": {
      "201": "contract58"
    },
    "request": "contract61",
    "requestRequired": true
  },
  {
    "path": "/Client",
    "method": "GET",
    "responses": {
      "200": "contract77"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Client",
    "method": "DELETE",
    "responses": {
      "204": null
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Client/blocked",
    "method": "GET",
    "responses": {
      "200": "contract78"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Client/history",
    "method": "GET",
    "responses": {
      "200": "contract79"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Client/link",
    "method": "POST",
    "responses": {
      "200": "contract77"
    },
    "request": "contract80",
    "requestRequired": true
  },
  {
    "path": "/permanent",
    "method": "DELETE",
    "responses": {
      "204": null
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Client/settings/clientPortal",
    "method": "PUT",
    "responses": {
      "200": null
    },
    "request": "contract81",
    "requestRequired": true
  },
  {
    "path": "/ChatMessage",
    "method": "POST",
    "responses": {
      "201": "contract82"
    },
    "request": "contract85",
    "requestRequired": true
  },
  {
    "path": "/Block/user/blocked",
    "method": "GET",
    "responses": {
      "200": "contract78"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Block/user",
    "method": "GET",
    "responses": {
      "200": "contract87"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Block/user",
    "method": "POST",
    "responses": {
      "201": "contract88"
    },
    "request": "contract89",
    "requestRequired": true
  },
  {
    "path": "/Block/org/blocked",
    "method": "GET",
    "responses": {
      "200": "contract78"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Block/org",
    "method": "GET",
    "responses": {
      "200": "contract90"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Block/org",
    "method": "POST",
    "responses": {
      "201": "contract91"
    },
    "request": "contract92",
    "requestRequired": true
  },
  {
    "path": "/Automation/deploy",
    "method": "POST",
    "responses": {
      "204": null
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Auth/signin",
    "method": "GET",
    "responses": {
      "200": "contract93"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Auth/signin/cid",
    "method": "GET",
    "responses": {
      "200": "contract93"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Auth/signOut",
    "method": "POST",
    "responses": {
      "204": null
    },
    "request": "contract94",
    "requestRequired": false
  },
  {
    "path": "/Auth/register",
    "method": "GET",
    "responses": {
      "200": "contract93"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Auth/apiTokens",
    "method": "GET",
    "responses": {
      "200": "contract95"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Auth/apiTokens",
    "method": "POST",
    "responses": {
      "201": "contract96"
    },
    "request": "contract97",
    "requestRequired": true
  },
  {
    "path": "/Auth/exchange",
    "method": "POST",
    "responses": {
      "200": "contract93"
    },
    "request": "contract98",
    "requestRequired": false
  },
  {
    "path": "/Auth/impersonate",
    "method": "POST",
    "responses": {
      "200": "contract93"
    },
    "request": "contract99",
    "requestRequired": true
  },
  {
    "path": "/Auth/permissions",
    "method": "GET",
    "responses": {
      "200": "contract100"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/AuditLog/botInteraction",
    "method": "POST",
    "responses": {
      "201": "contract101"
    },
    "request": "contract102",
    "requestRequired": true
  },
  {
    "path": "/Admin/auth/bypass",
    "method": "POST",
    "responses": {
      "200": null
    },
    "request": "contract103",
    "requestRequired": true
  },
  {
    "path": "/Team/{id}",
    "method": "GET",
    "responses": {
      "200": "contract0"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Team/setLead/{newTeamLeadId}",
    "method": "POST",
    "responses": {
      "200": "contract0"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Team/status/{newStatus}",
    "method": "POST",
    "responses": {
      "200": null
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Team/remove/{targetId}",
    "method": "POST",
    "responses": {
      "200": null
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Team/dispatch/remove/{userId}",
    "method": "POST",
    "responses": {
      "200": null
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Team/{id}/voiceChannel",
    "method": "PATCH",
    "responses": {
      "200": "contract0"
    },
    "request": "contract14",
    "requestRequired": true
  },
  {
    "path": "/Team/dispatch/{id}",
    "method": "DELETE",
    "responses": {
      "204": null
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Staff/discordId/{discordId}",
    "method": "GET",
    "responses": {
      "200": "contract18"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Staff/rsiHandle/{handle}",
    "method": "GET",
    "responses": {
      "200": "contract18"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Staff/{id}",
    "method": "GET",
    "responses": {
      "200": "contract18"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Staff/{id}",
    "method": "DELETE",
    "responses": {
      "204": null
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Staff/{id}/setRank",
    "method": "POST",
    "responses": {
      "200": "contract18"
    },
    "request": "contract25",
    "requestRequired": true
  },
  {
    "path": "/Staff/{id}/department",
    "method": "POST",
    "responses": {
      "200": "contract18"
    },
    "request": "contract26",
    "requestRequired": true
  },
  {
    "path": "/Staff/{id}/certification/add",
    "method": "POST",
    "responses": {
      "200": "contract18"
    },
    "request": "contract27",
    "requestRequired": true
  },
  {
    "path": "/Staff/{id}/certification/remove",
    "method": "POST",
    "responses": {
      "200": "contract18"
    },
    "request": "contract27",
    "requestRequired": true
  },
  {
    "path": "/Staff/{id}/update/rsiHandle",
    "method": "POST",
    "responses": {
      "200": "contract18"
    },
    "request": "contract28",
    "requestRequired": true
  },
  {
    "path": "/Staff/{id}/update/discordId",
    "method": "POST",
    "responses": {
      "200": "contract18"
    },
    "request": "contract29",
    "requestRequired": true
  },
  {
    "path": "/Staff/{id}/suspension/add",
    "method": "POST",
    "responses": {
      "200": "contract30"
    },
    "request": "contract31",
    "requestRequired": true
  },
  {
    "path": "/Staff/{id}/suspension/remove",
    "method": "POST",
    "responses": {
      "200": "contract18"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Code/redeem/{code}",
    "method": "POST",
    "responses": {
      "200": null
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Code/redeemed/{userId}",
    "method": "GET",
    "responses": {
      "200": "contract33"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Emergency/{id}",
    "method": "GET",
    "responses": {
      "200": "contract58"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Emergency/{id}/client",
    "method": "GET",
    "responses": {
      "200": "contract63"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Emergency/{id}/messages",
    "method": "PATCH",
    "responses": {
      "200": "contract58"
    },
    "request": "contract64",
    "requestRequired": true
  },
  {
    "path": "/Emergency/{id}/cancelWithReason",
    "method": "POST",
    "responses": {
      "200": null
    },
    "request": "contract65",
    "requestRequired": true
  },
  {
    "path": "/Emergency/{id}/refuse",
    "method": "POST",
    "responses": {
      "200": null
    },
    "request": "contract66",
    "requestRequired": true
  },
  {
    "path": "/Emergency/{id}/noContact",
    "method": "POST",
    "responses": {
      "200": null
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Emergency/{id}/setStatus",
    "method": "POST",
    "responses": {
      "200": null
    },
    "request": "contract67",
    "requestRequired": true
  },
  {
    "path": "/Emergency/{id}/complete",
    "method": "POST",
    "responses": {
      "200": null
    },
    "request": "contract67",
    "requestRequired": true
  },
  {
    "path": "/Emergency/{id}/accept",
    "method": "POST",
    "responses": {
      "200": "contract58"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Emergency/{id}/decline",
    "method": "POST",
    "responses": {
      "204": null
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Emergency/{emergencyId}/assignTeam",
    "method": "POST",
    "responses": {
      "200": null
    },
    "request": "contract68",
    "requestRequired": true
  },
  {
    "path": "/Emergency/{id}/rate",
    "method": "POST",
    "responses": {
      "200": null
    },
    "request": "contract69",
    "requestRequired": true
  },
  {
    "path": "/Emergency/{id}/aar",
    "method": "PUT",
    "responses": {
      "200": "contract70"
    },
    "request": "contract71",
    "requestRequired": true
  },
  {
    "path": "/Emergency/{id}/aar/resource",
    "method": "POST",
    "responses": {
      "200": "contract70"
    },
    "request": "contract72",
    "requestRequired": true
  },
  {
    "path": "/Emergency/{id}/assign",
    "method": "POST",
    "responses": {
      "201": "contract73"
    },
    "request": "contract74",
    "requestRequired": true
  },
  {
    "path": "/Emergency/{id}/teamDetails",
    "method": "GET",
    "responses": {
      "200": "contract75"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Message/{id}",
    "method": "GET",
    "responses": {
      "200": "contract76"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Client/{id}",
    "method": "GET",
    "responses": {
      "200": "contract77"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/ChatMessage/{id}",
    "method": "GET",
    "responses": {
      "200": "contract82"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/ChatMessage/{id}",
    "method": "PUT",
    "responses": {
      "200": "contract82"
    },
    "request": "contract83",
    "requestRequired": true
  },
  {
    "path": "/ChatMessage/{id}",
    "method": "DELETE",
    "responses": {
      "204": null
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/ChatMessage/conversation/{emergencyId}",
    "method": "GET",
    "responses": {
      "200": "contract84"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Block/{id}",
    "method": "GET",
    "responses": {
      "200": "contract86"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Block/{id}",
    "method": "DELETE",
    "responses": {
      "204": null
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Block/user/{id}",
    "method": "PUT",
    "responses": {
      "201": "contract88"
    },
    "request": "contract89",
    "requestRequired": true
  },
  {
    "path": "/Block/org/{id}",
    "method": "PUT",
    "responses": {
      "201": "contract91"
    },
    "request": "contract92",
    "requestRequired": true
  },
  {
    "path": "/Auth/apiTokens/{id}",
    "method": "DELETE",
    "responses": {
      "204": null
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Admin/apiToken/{userId}",
    "method": "POST",
    "responses": {
      "201": "contract96"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Team/dispatch/{teamId}/status/{newStatus}",
    "method": "POST",
    "responses": {
      "200": null
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Emergency/{emergencyId}/assignTeam/{teamId}",
    "method": "POST",
    "responses": {
      "200": null
    },
    "request": "contract68",
    "requestRequired": true
  },
  {
    "path": "/Emergency/{id}/aar/resource/{resourceId}",
    "method": "DELETE",
    "responses": {
      "200": "contract70"
    },
    "request": null,
    "requestRequired": false
  },
  {
    "path": "/Emergency/{id}/remove/{staffId}",
    "method": "POST",
    "responses": {
      "204": null
    },
    "request": null,
    "requestRequired": false
  }
] as const;
export const eventValidators = {
  "Emergency": "contract104",
  "Team": "contract105",
  "Staff": "contract106",
  "Client": "contract107",
  "ChatMessage": "contract108",
  "AuditLog": "contract109",
  "FannedContent": "contract110",
  "Deployment": "contract111"
} as const;
