export class product {
  name: string;
  img: string;
  price: number;
  type: string;

  constructor(
    name: string,
    img: string,
    price: number,
    type: string
  ) {
    this.name = name;
    this.img = img;
    this.price = price;
    this.type = type;
  }
}
