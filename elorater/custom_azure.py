from storages.backends.azure_storage import AzureStorage

#production
class AzureMediaStorage(AzureStorage):
    account_name = 'elotesting' # Must be replaced by your <storage_account_name>
    account_key = 'Tas+hz6koBREtBFD11wfxSDqoo6Vj8TpnIOfe8mbFzgxBUmn3JWG9C8fYM3eCx5aZqShsP+TAwPg+AStdX9Qdg==' # Must be replaced by your <storage_account_key>
    azure_container = 'media'
    expiration_secs = None

class AzureStaticStorage(AzureStorage):
    account_name = 'elotesting' # Must be replaced by your storage_account_name
    account_key = 'Tas+hz6koBREtBFD11wfxSDqoo6Vj8TpnIOfe8mbFzgxBUmn3JWG9C8fYM3eCx5aZqShsP+TAwPg+AStdX9Qdg==' # Must be replaced by your <storage_account_key>
    azure_container = 'static'
    expiration_secs = None


