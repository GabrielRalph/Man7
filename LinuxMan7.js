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
      this.draw();

    }
  }

  set json(json) {
    this._json = json;
    this.draw();
  }

  filter(json){
    let search = this.search.value.toUpperCase();
    if (search.length < 3) search = null;
    // console.log(search);
    let news = [];
    let keys = {};
    let newJson = json;

    for (let i = 0; i < 5; i++) {
      // console.log(i);
      let nJson = {};

      for (let symbol_name in newJson) {
        let str = symbol_name + newJson[symbol_name][i];
        str = str.toUpperCase();
        // if (search != null)console.log(str);
        if (search == null || str.indexOf(search) !== -1){
          // if (search!==null)console.log(str);
          keys[symbol_name] = 1;
          news.push({
            name: symbol_name,
            details: newJson[symbol_name]
          })
        }else{
          nJson[symbol_name] = newJson[symbol_name];
        }
      }

      newJson = nJson;
    }
    return news;
  }

  draw(json = this._json){
    this.body.innerHTML = "";
    let man7 = this.filter(json)

    for (let symbol of man7) {
      let details = [];

      let symbols = new LinuxSymbol(symbol.name);
      for (let detail in symbol.details){
        if (detail == 0){
          symbols.appendChildToHead(new Pre(symbol.details[detail]))
          symbols.description = symbol.details[detail];
        } else {
          details.push({name: TITLE_LIST[detail], pre: symbol.details[detail]});
        }
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
