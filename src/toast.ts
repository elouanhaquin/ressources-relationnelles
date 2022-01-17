


export async function presentToastWithOptions() {
    const toast = document.createElement('ion-toast');
    toast.header = 'Toast header';
    toast.message = 'Click to Close';
    toast.position = 'top';
    toast.buttons = [
      {
        side: 'start',
        icon: 'star',
        text: 'Favorite',
        handler: () => {
          console.log('Favorite clicked');
        },
      },
      {
        text: 'Done',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        },
      },
    ];
  
    document.body.appendChild(toast);
    await toast.present();
  
    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }