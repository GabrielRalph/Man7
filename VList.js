import {SvgPlus} from 'https://www.svg.plus/3.5.js'

class VList extends SvgPlus{
  constructor(name, list, ItemClass, state = true){
    super('DIV');

    this.props = {class: 'v-list'}
    this.ItemClass = ItemClass;

    this._headerElement = this.createChild('DIV');
    this._headerElement.props = {class: 'header'}

    this._listElement = this.createChild('DIV')
    this._listElement.props = {
      class: 'list',
      style: {
        overflow: "hidden"
      }
    }

    this._headerTitle = this.createChildOfHead('H1');
    // this._headerTitle.styles = { 'font-size': '1em'}

    this._headerTitle.ondblclick = (e) => {
      this.ontitledblclick(e)
    }

    this._headerTitle.onclick = (e) => {
      this.ontitleclick(e)
    }

    //Instantiate private variables
    this._name = null;
    this._open = true;
    this._moving = false;

    this.name = name;
    this.list = list;

    this.setOpen(state)
  }

  setOpen(val){
    if (val){
      this._open = true;
      this.height = "auto";
    }else{
      this._open = false;
      this.height = 0;
    }
  }

  //Runs a method using the event bus
  runEvent(eventName, params){
    if ( eventName in this ) {
      if ( this[eventName] instanceof Function ){
        this[eventName](params);
      }
    }
  }

  clear(){
    this._listElement.innerHTML = "";
  }

  async addElement(element){
    if (element instanceof Element){
      // let height = this.height;
      // this._listElement.styles = {
      //   height: `${height}px`
      // }
      this._listElement.appendChild(element);
      // let dh = this.height - height;
      // await this.waveTransistion((t) => {
      //   this._listElement.styles = {
      //     height: `${height + dh*t}`
      //   }
      // }, 500, true)
      // this._listElement.styles = {
      //   height: 'auto'
      // }
    }
  }

  removeElement(element){
    if (element instanceof Element && this._listElement.contains(element)){
      this._listElement.removeChild(element);
    }
  }

  ontitleclick(){
    this.open = !this.open
  }

  ontitledblclick(){
  }

  //Creates a child in the header
  createChildOfHead(name){
    return this._headerElement.createChild(name);
  }

  //Appends a child to the header
  appendChildToHead(element){
    return this._headerElement.appendChild(element);
  }

  //Removes a child from the header
  removeChildFromHead(element){
    if (this._headerElement.contains(element)){
      this._headerElement.removeChild(element);
    }
  }

  //Clears head
  clearHead(){
    this._headerElement.innerHTML = "";
    this.appendChildToHead(this._headerTitle);
  }

  async show(){
    let height = this.height;
    this._moving = true;
    await this.waveTransistion((t) => {
      this.height = t*height
    }, 200, true)
    this.height = 'auto'
    this._moving = false;
  }

  async hide(){
    this._moving = true;
    let height = this.height;
    await this.waveTransistion((t) => {
      this.height = t*height
    }, 200, false)
    this._moving = false;
  }

  get moving() {return this._moving}

  set ItemClass(ItemClass) {
    if (ItemClass instanceof Function && ItemClass.prototype instanceof SvgPlus) {
      let string = (`${ItemClass}`);
      const match = string.match(/^\s*class\s*(\w*)/)
      if (match[1]) {
        let name = match[1];
        name = name.replace(/(\w)([A-Z])/g, "$1-$2").toLowerCase();
        this.class = "v-list " + name + "s";
      }
      this._ItemClass = ItemClass
    }else{
      this._ItemClass = null
    }
  }
  get ItemClass(){ return this._ItemClass}

  set list(list){
    this._listElement.innerHTML = ""
    if (!Array.isArray(list)) return;
    if (this.ItemClass != null) {
      for (let item of list){
        let el = new this.ItemClass(item);
        if (this.initItem instanceof Function){
          this.initItem(el)
        }
        this.addElement(el)
      }
    }
  }

  set open(val){
    if (this.moving) return;
    if (val && !this.open){
      this.runEvent('onstatechange', true)
      this.show();
      this._open = true;
    }else if(!val && this.open){
      this.runEvent('onstatechange', false)
      this.hide();
      this._open = false;
    }
  }
  get open(){
    return this._open;
  }

  get height(){
    let bbox = this._listElement.scrollHeight;
    return bbox;
  }
  set height(height){
    if (typeof height === 'number') {
      height = height + 'px'
    }
    this._listElement.styles = {
      height: height
    }
  }
  //Set and get the list name
  set name(name){
    this._name = null;
    this._headerTitle.innerHTML = "";

    if (typeof name !== 'string') return;

    this._headerTitle.innerHTML = name;
    this._name = name;
  }
  get name(){
    return this._name;
  }
}

export {VList, SvgPlus}
