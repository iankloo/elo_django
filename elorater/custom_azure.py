from storages.backends.azure_storage import AzureStorage

#dev
# class AzureMediaStorage(AzureStorage):
#     account_name = 'djangostaticstorage' # Must be replaced by your <storage_account_name>
#     account_key = 'mzZRx1tP2DawI6KTU2TUk4Lx4qtZ6inJ2XeRIhcEtZSr5C2lVR0mjjp2DncW7LljGCAPeZXgjT5HQeakGwKDFw==' # Must be replaced by your <storage_account_key>
#     azure_container = 'media'
#     expiration_secs = None

# class AzureStaticStorage(AzureStorage):
#     account_name = 'djangostaticstorage' # Must be replaced by your storage_account_name
#     account_key = 'mzZRx1tP2DawI6KTU2TUk4Lx4qtZ6inJ2XeRIhcEtZSr5C2lVR0mjjp2DncW7LljGCAPeZXgjT5HQeakGwKDFw==' # Must be replaced by your <storage_account_key>
#     azure_container = 'static'
#     expiration_secs = None


#production
class AzureMediaStorage(AzureStorage):
    account_name = 'sadseelo' # Must be replaced by your <storage_account_name>
    account_key = 'cy/jRlJnMAi+azPe/rw4VCdI3qk3mn5KgyLKZ4K7+34fo8FMaLs3a3Jr1HyBG6F89hB45LHiDz/UdqNNdTqbbQ==' # Must be replaced by your <storage_account_key>
    azure_container = 'media'
    expiration_secs = None

class AzureStaticStorage(AzureStorage):
    account_name = 'sadseelo' # Must be replaced by your storage_account_name
    account_key = 'cy/jRlJnMAi+azPe/rw4VCdI3qk3mn5KgyLKZ4K7+34fo8FMaLs3a3Jr1HyBG6F89hB45LHiDz/UdqNNdTqbbQ==' # Must be replaced by your <storage_account_key>
    azure_container = 'static'
    expiration_secs = None