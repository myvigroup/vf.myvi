# Setup: SharePoint-Anbindung (App-Only / Client Credentials)

Die Berater loggen sich per E-Mail/Passwort ein (Supabase Auth).
Die Deals werden per **App-Only Token** direkt aus der SharePoint-Liste gelesen.
Kein Microsoft-Login für die Berater nötig.

## 1. Azure App Registration

1. Gehe zu [Azure Portal → App Registrations](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
2. Klicke **"New registration"**
3. Name: `Value Factory SharePoint Reader`
4. Supported account types: **Accounts in this organizational directory only** (Single tenant)
5. Redirect URI: leer lassen (nicht nötig für Client Credentials)
6. Klicke **Register**

## 2. Client Secret erstellen

1. In der App Registration → **Certificates & secrets**
2. **New client secret** → Beschreibung: `VF Dashboard` → **Add**
3. **Wert sofort kopieren** (wird nur einmal angezeigt) → `AZURE_AD_CLIENT_SECRET`

## 3. API Permissions (Application, NICHT Delegated!)

1. In der App Registration → **API permissions**
2. **Add a permission** → **Microsoft Graph** → **Application permissions**
3. Folgende Permission hinzufügen:
   - `Sites.Read.All`
4. **Grant admin consent** klicken (benötigt Global Admin)

> **Wichtig:** Es muss **Application permissions** sein, nicht Delegated!
> Client Credentials Flow hat keinen User-Kontext.

## 4. IDs herausfinden

### Tenant ID & Client ID
- In der App Registration → **Overview**
- **Application (client) ID** → `AZURE_AD_CLIENT_ID`
- **Directory (tenant) ID** → `AZURE_AD_TENANT_ID`

### SharePoint Site ID
Im Browser als authentifizierter Admin aufrufen:
```
https://graph.microsoft.com/v1.0/sites/mitnorm.sharepoint.com:/sites/MYVIDialoge
```
→ `id` Feld kopieren → `SHAREPOINT_SITE_ID`

### SharePoint List ID
```
https://graph.microsoft.com/v1.0/sites/{SITE_ID}/lists?$filter=displayName eq 'Dealliste MYVI Dialoge'
```
→ `id` Feld kopieren → `SHAREPOINT_LIST_ID`

## 5. Environment Variables

In `.env.local` hinzufügen:

```env
AZURE_AD_CLIENT_ID=deine-client-id
AZURE_AD_CLIENT_SECRET=dein-client-secret
AZURE_AD_TENANT_ID=dein-tenant-id
SHAREPOINT_SITE_ID=deine-site-id
SHAREPOINT_LIST_ID=deine-list-id
```

## 6. So funktioniert es

```
Berater → Login (E-Mail/Passwort via Supabase)
              ↓
         Dashboard liest user.email aus Session
              ↓
         Server ruft SharePoint via App-Only Token auf
         (Client Credentials → kein User-Login bei Microsoft)
              ↓
         Filter: Berater-Feld == user.email
              ↓
         Berater sieht nur seine eigenen Deals
```
