function createCustomEvent() { return 'customEvent';}
function post() { return Promise.of('')}

const CANCEL_URL = '/web/totes/api/v1/cart/cancelOrder';

/**
 * Custom Element to display shopping cart icon with number of items.
 * It is expected of application to handle following events to provide cart details and checkout process.
 * <br/><br/>
 * [Demo](../components/AgentCartComponent.html)
 *
 * ###Events
 * - **cart-clicked:**
 * When user clicks on the cart icon
 * - **cart-toggled:**
 * When user hover or focuses over the cart icon,
 * Event.detail provides actual mouse/keyboard event like mouseout, mouseover, focus and blur
 */
export class ExampleKlass {
  /** Response of /cart/fetch api to show number of items in the cart */
  cartData: any;
  /** Key value pairs for English and French */
  i18n: any;
  /** @ignore */
  agentHeaderEl: any;

  /** @ignore */
  connectedCallback() {
    this.agentHeaderEl = this.closest('agent-header');
    if (this.agentHeaderEl) {
      this.i18n = this.agentHeaderEl.i18n.agentCart;
    }

    this.renderWith('').then(_ => {
      this.setShoppingCart(this.cartData);
    });
  }

  /** @ignore */
  toggleCart(event: Event) {
    const customEvent = createCustomEvent('cart-toggled', {
      bubbles: true,
      detail: event.type
    });
    this.dispatchEvent(customEvent);
  }

  /** @ignore */
  cartClicked(event: Event) {
    if (this.querySelector('.shopping-cart').classList.contains('empty')) { return; }
    this.classList.add('visible');
  }

  /**
   * Call this method to set shopping cart data received for /cart/fetch api.
   * Should be called whenever user adds/removes/updates shopping cart.
   */
  setShoppingCart(cartData) {
    this.cartData = cartData;
    this.removeItems();
    if (cartData && cartData.success === true && (cartData.ppc.length || cartData.hup.length || cartData.nac.length)) {
      const items = cartData.ppc.concat(cartData.hup, cartData.nac);
      this.querySelector('.items').innerHTML = items.length;
      this.querySelector('.shopping-cart').classList.remove('empty');
      this.appendItems(items);
    } else {
      this.querySelector('.shopping-cart').classList.add('empty');
      this.classList.remove('visible');
    }
  }

  /** @ignore */
  appendItems(items) {
    const quotesUl = this.querySelector('.cart-popup .quotes-list');
    const ordersUl = this.querySelector('.cart-popup .orders-list');

    items.forEach(item => {
      const ctn = item.assemblyIds.map(id => {
        if (id) {
          return `${id.substring(0, 3)} ${id.substring(3, 6)}-${id.substring(6, 10)}`;
        }
      }).join(' ');
      const li = document.createElement('li');
      li.setAttribute('data-order-id', item.orderId);
      li.setAttribute('data-order-type', item.activityType);
      if (item.quotation) {
        li.innerHTML = this.getQuotationTemplate(item, ctn);
        if (!quotesUl.firstChild) { quotesUl.innerHTML = `<li><div class="title">${this.i18n.myQuotes}</div></li>`; }
        quotesUl.appendChild(li);
      } else {
        li.innerHTML = this.getOrderTemplate(item, ctn);
        if (!ordersUl.firstChild) { ordersUl.innerHTML = `<li><div class="title">${this.i18n.myShoppingList}</div></li>`; }
        ordersUl.appendChild(li);
      }
      li.querySelector('a') && li.querySelector('a').addEventListener('click', this.cancelOrder.bind(this));
      li.addEventListener('click', this.itemClicked.bind(this));
    });

    if (quotesUl.firstChild && ordersUl.firstChild) {
      ordersUl.firstElementChild.classList.add('top-border');
    }
  }

  /** @ignore */
  getQuotationTemplate(item, ctn) {
    return `
    <div class="title">
      <span>${this.i18n[item.activityType.toLowerCase()]} <span>${ctn}</span></span>
      ${item.quoteExpired ? '' :
        `<a href="javascript:void(0)" aria-label="${this.i18n.delete}"><i class="rui-icon-delete-cleanup"></i></a>
        <img class="loading-img" alt="loading"/>`}
    </div>
    <div class="quote">${this.i18n.quote} ${item.orderId}</div>
    <div class="expiry">${item.quoteExpired ? this.i18n.expired : this.i18n.expires} 2019-09-07</div>`;
  }

  /** @ignore */
  getOrderTemplate(item, ctn) {
    return `
    <div class="title">
      <span>${this.i18n[item.activityType.toLowerCase()]} <span>${ctn}</span></span>
      <a href="javascript:void(0)" aria-label="${this.i18n.delete}"><i class="rui-icon-delete-cleanup"></i></a>
      <img class="loading-img" alt="loading"/>
    </div>`;
  }

  /** @ignore */
  removeItems() {
    Array.from(this.querySelectorAll('.cart-popup ul')).forEach(ul => {
      while (ul.lastChild) {
        ul.removeChild(ul.lastChild);
      }
    });
  }

  /** @ignore */
  cancelOrder(event) {
    event.stopPropagation();
    const liEl = event.currentTarget.parentElement.parentElement;
    const orderId = liEl.getAttribute('data-order-id');
    const orderType = liEl.getAttribute('data-order-type');
    liEl.classList.add('loading');

    const data = {
      'currentOrderId': orderId
    };
    return post.bind(this)(CANCEL_URL, data, 'text/plain')
      .then(resp => {
        this.cartData[orderType.toLowerCase()] = this.cartData[orderType.toLowerCase()].filter(i => i.orderId !== orderId);
        this.setShoppingCart(this.cartData);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        liEl.classList.remove('loading');
      });
  }

  /** @ignore */
  itemClicked(event) {
    const orderId = event.currentTarget.getAttribute('data-order-id');
    const orderType = event.currentTarget.getAttribute('data-order-type');
    const order = this.cartData[orderType.toLowerCase()].find(i => i.orderId === orderId);

    const customEvent = createCustomEvent('cart-item-clicked', {
      bubbles: true,
      detail: {order: order}
    });
    this.dispatchEvent(customEvent);
    this.classList.remove('visible');
  }

  /** @ignore */
  closeShoppingCart(event) {
    this.classList.remove('visible');
  }

}

// ExampleKlass.define('agent-cart',  ExampleKlass);