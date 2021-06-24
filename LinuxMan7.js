import {VList, SvgPlus} from "./VList.js"
let TITLE_LIST = ["Name", "Synopsis", "Description", "Return Value", "ERRORS"];
let TITLE_SET = {
  NAME: 0,
  SYNOPSIS: 1,
  DESCRIPTION: 2,
  RETURN_VALUE: 3,
  ERRORS: 4
}

class Pre extends SvgPlus{
  constructor(contents){
    super("PRE");
    this.innerHTML = contents;
  }
}

class LinuxDetail extends VList{
  constructor(detail){
    super(detail.name, [detail.pre], Pre);
    this.setOpen(detail.name == "Synopsis");
  }
}

class LinuxSymbol extends VList{
  constructor(symbol, details){
    super(symbol, details, LinuxDetail);
    this.setOpen(false);
  }
}

class LinuxMan7 extends SvgPlus{
  constructor(){
    super('DIV');

    this.class = "linux-man7";
    this.body = this.createChild("DIV", {class: "symbols"});
    this.search = this.createChild("DIV", {class: "search"}).createChild("INPUT");
    this.search.onkeyup = () => {
      let value = this.search.value.toUpperCase();
      
    }
  }

  set json(json) {
    this._json = json;
    this.body.innerHTML = "";
    for (let symbol_name in json) {
      let symbol = json[symbol_name];
      let details = [];
      let symbols = new LinuxSymbol(symbol_name);
      for (let detail in symbol){

        if (detail == 0){
          symbols.appendChildToHead(new Pre(symbol[detail]))
          symbols.description = symbol[detail];
        } else details.push({name: TITLE_LIST[detail], pre: symbol[detail]});
      }
      symbols.list = details;
      this.body.appendChild(symbols)
    }
  }

  static getHTMLLinuxSymbolName(html) {
    let name = html.getElementsByClassName("headline")[0];
    name = name.innerHTML;
    name = name.split(/\s/)[0];
    return name.toLowerCase();
  }

  static HTMLSymbolToJSON(html) {
    let json = {};

    let data = [];
    let titles = html.getElementsByTagName("H2");
    for (let title of titles) {
      let pre = title.nextSibling;
      let name = title.firstChild.id;

      if (name in TITLE_SET) {
        data[TITLE_SET[name]] = pre.innerHTML;
      }
    }

    json[LinuxMan7.getHTMLLinuxSymbolName(html)] = data;
    return json;
  }
}
export {LinuxMan7}
