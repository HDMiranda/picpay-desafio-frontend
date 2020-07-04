import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Desafio Picpay Front-end';

  users: any;
  error: any;

  disabledModal = true
  sendCash = false

  cashSend = null
  nameUserSelect = ''
  titleModal = ''
  descModal = ''

  returnPay = null

  selectCard = 0

  listCard = [
    // valid card
    {
      card_number: '1111111111111111',
      cvv: 789,
      expiry_date: '01/18',
    },
    // invalid card
    {
      card_number: '4111111111111234',
      cvv: 123,
      expiry_date: '01/20',
    },
    {
      card_number: '6111111111111456',
      cvv: 456,
      expiry_date: '01/19',
    },
  ];

  postData = {
    card_number: null,
    cvv: null,
    expiry_date: null,
    destination_user_id: null,
    value: null
  }

  constructor(private http: HttpClient) { }

  ngOnInit() {
    let listUser = this.http.get("https://www.mocky.io/v2/5d531c4f2e0000620081ddce")
    listUser.subscribe((dataUser) => {
      this.users = dataUser;
    }, (error: any) => {
      this.error = error;
      console.error("ERROR: ", error)
    })
  }

  sendInfo(selectCard) {
    this.postData.card_number = this.listCard[selectCard].card_number
    this.postData.cvv = this.listCard[selectCard].cvv
    this.postData.expiry_date = this.listCard[selectCard].expiry_date
    this.postData.value = this.cashSend

    this.http.post("https://run.mocky.io/v3/533cd5d7-63d3-4488-bf8d-4bb8c751c989", this.postData).toPromise()
      .then(data => {
        this.returnPay = data

        if (this.cashSend === null || this.cashSend === '' || this.cashSend == '0') {
          alert('Insira o valor a ser enviado.')
        } else {
          this.sendCash = true
          this.titleModal = 'Recibo de pagamento'

          if (this.listCard[selectCard].card_number !== '1111111111111111') {
            this.descModal = 'O pagamento <strong>não</strong> foi concluido com sucesso.'
          } else {
            this.descModal = 'O pagamento foi concluido com sucesso.'
          }
        }


      }, (error: any) => {
        this.error = error;
        console.error("ERROR: ", error)
      })
  }

  activedModal() {
    this.disabledModal = !this.disabledModal
  }

  selectUserToPay(user) {
    this.cashSend = ''
    this.descModal = ''
    this.nameUserSelect = user.name
    this.titleModal = 'Pagamento para <span>' + this.nameUserSelect + '</span>'
    this.sendCash = false
    this.postData.destination_user_id = user.id
    this.activedModal()
  }

}



