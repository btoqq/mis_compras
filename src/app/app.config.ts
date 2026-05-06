import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { IonicStorageModule, Storage } from '@ionic/storage-angular'; // Importa ambos
import { Drivers } from '@ionic/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... otros providers que tengas (provideRouter, etc)
    
    importProvidersFrom(
      IonicStorageModule.forRoot({
        name: '__miscompras_db',
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
      })
    ),
    // ESTA LÍNEA ES LA QUE MATA EL ERROR NG0201
    Storage 
  ]
};