import { Injectable } from "@angular/core";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Injectable({
  providedIn: "root",
})
export class PdfService {
  bodyTable = [];
  constructor() { }

  async generarPDF(detalle, header, results,cai) {
    
    

    let temp = [];
    let total=0.0;
    this.bodyTable=[];
    this.bodyTable.push([
        { text: "Cantidad", style: "tableHeader" },
        { text: "Descripcion", style: "tableHeader" },
        { text: "P/U", style: "tableHeader" },
        { text: "total", style: "tableHeader" },
      
    ])
    detalle.forEach((element, index) => {
      total+=Number(element['subtotal']['$numberDecimal']);
      let _fillcolor = ((index % 2) === 0) ? "#eeeeff" : "#ffffff";
      temp=[];
      temp.push(
        {
          text: element.cantidad, border: [true, false, false, false],
          fillColor: _fillcolor
        },{
          text: element['idProducto']['nombre'], border: [true, false, false, false],
          fillColor: _fillcolor
        },{
          text: element['idProducto']['precio']['$numberDecimal'], border: [true, false, false, false],
          fillColor: _fillcolor
        },{
          text: Number(element['subtotal']['$numberDecimal']).toString(), border: [true, false, true, false],
          fillColor: _fillcolor
        })
        
        

        this.bodyTable.push(temp);
        // temp=[];
        
    });
    const date = new Date(cai['fechaFin']).toLocaleDateString();
    
    var dd = {
      content: [
        {
          aligment: "justify",
          columns: [
            { text: "Logo", alignment: "left" },
            {
              text: "FACTURA\nNo. "+ cai['numInifactura'],
              alignment: "right",
              fontSize: 10,
            },
          ],
        },
        {
          text: `${header['idCompania']['nombre']}. Direccion: ${header['idCompania']['direccion']}`,
          alignment: "left",
          fontSize: 10,
        },

        {
          text: `R.T.N.: ${header['idCompania']['rtn']}`,
          alignment: "left",
          fontSize: 10,
        },

        {
          text: `Telefono: ${header['idCompania']['telefono']}`,
          alignment: "justify",
          fontSize: 10,
        },
        {
          text: `Correo: ${header['idCompania']['correo']}`,
          alignment: "justify",
          fontSize: 10,
        },
        {
          text: "CAI: " +  cai['numeroAutorizacion'],
          alignment: "justify",
          fontSize: 10,
        },
        {
          text: "Rango de autorizacion: " + cai['numeroInicial'],
          alignment: "justify",
          fontSize: 10,
        },
        {
          text: "Fecha limite de emision: " + date,
          alignment: "justify",
          fontSize: 10,
          margin: [0, 0, 0, 10],
        },

        {
          margin: [0, 0, 0, 10],
          table: {
            widths: [50, "*"],

            body: [["CLIENTE", header['idUsuario']['nombre']]],
          },
        },
        {
          table: {
            widths: [50, "*", 70, 70],
            body: this.bodyTable
            // [
              
              
              // [
              //   {
              //     text: "100",
              //     border: [true, false, false, false],
              //     fillColor: "#eeeeff",
              //   },
              //   {
              //     text: 1,
              //     border: [true, false, false, false],
              //     fillColor: "#eeeeff",
              //   },
              //   {
              //     text: 1,
              //     border: [true, false, false, false],
              //     fillColor: "#eeeeff",
              //   },
              //   {
              //     text: 1,
              //     border: [true, false, true, false],
              //     fillColor: "#eeeeff",
              //   },
              // ],
            // ],
          },
        },
        {
          table: {
            widths: [50, "*", 70, 70],
            body: [
              [
                {
                  text: "",
                  border: [false, true, false, false],
                  fillColor: "#FFFFFF",
                },
                {
                  text: "",
                  border: [false, true, false, false],
                  fillColor: "#FFFFFF",
                },
                {
                  text: "Total",
                  border: [true, true, true, true],
                  fillColor: "#eeeeff",
                },
                {
                  text: total,
                  border: [true, true, true, true],
                  fillColor: "#eeeeff",
                },
              ],
            ],
          },
        },
        {
          canvas: [
            {
              type: "rect",
              x: 0,
              y: 0,
              w: 285,
              h: 23,
              r: 3,
              lineColor: "#ccc",
            },
          ],
        },
        { text: "aquuii", absolutePosition: { x: 45, y: 250 } },
        {
          text: 'LA FACTURA ES BENEFICIO DE TODO "EXIJALA"',
          margin: [0, 10, 0, 10],
        },
        {
          alignment: "justify",
          columns: [
            {
              style: "tableExample",
              table: {
                widths: ["*", "*"],
                body: [
                  [
                    {
                      text: "N° Correlativo de orden de compra",
                      bold: true,
                      border: [false, false, false, false],
                    },
                    { text: "total" },
                  ],
                  [
                    {
                      text: "No° Correlativo de constancia de registro exonerado",
                      bold: true,
                      border: [false, false, false, false],
                    },
                    { text: "total" },
                  ],
                  [
                    {
                      text: "N° identificativo del registro de la SAG",
                      bold: true,
                      border: [false, false, false, false],
                    },
                    { text: "total" },
                  ],
                ],
              },
            },
            {
              style: "tableExample",
              table: {
                widths: [140, 10, "*"],
                body: [
                  [
                    {
                      text: "IMPORTE EXONERADO",
                      bold: true,
                      border: [false, false, false, false],
                    },
                    { text: "L.", border: [false, false, false, false] },
                    { text: "total" },
                  ],
                  [
                    {
                      text: "IMPORTE EXCENTO",
                      bold: true,
                      border: [false, false, false, false],
                    },
                    { text: "L.", border: [false, false, false, false] },
                    { text: "total" },
                  ],
                  [
                    {
                      text: "IMPORTE GRAVADO 15%",
                      bold: true,
                      border: [false, false, false, false],
                    },
                    { text: "L.", border: [false, false, false, false] },
                    { text: "total" },
                  ],
                  [
                    {
                      text: "IMPORTE GRAVADO 18%",
                      bold: true,
                      border: [false, false, false, false],
                    },
                    { text: "L.", border: [false, false, false, false] },
                    { text: "total" },
                  ],
                  [
                    {
                      text: "IMPORTE EXONERADO",
                      bold: true,
                      border: [false, false, false, false],
                    },
                    { text: "L.", border: [false, false, false, false] },
                    { text: "total" },
                  ],

                  [
                    {
                      text: "ISV 15%",
                      bold: true,
                      border: [false, false, false, false],
                    },
                    { text: "L.", border: [false, false, false, false] },
                    { text: "total" },
                  ],
                  [
                    {
                      text: "ISV 18%",
                      bold: true,
                      border: [false, false, false, false],
                    },
                    { text: "L.", border: [false, false, false, false] },
                    { text: "total" },
                  ],
                  [
                    {
                      text: "TOTAL A PAGAR",
                      bold: true,
                      border: [false, false, false, false],
                    },
                    { text: "L.", border: [false, false, false, false] },
                    { text: "total" },
                  ],
                ],
              },
            },
          ],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        bigger: {
          fontSize: 15,
          italics: true,
        },
      },
      defaultStyle: {
        columnGap: 20,
      },
    };
    // pdfMake.createPdf(documentDefinition).download();
    await pdfMake.createPdf(dd).download(`${name}-${this.generaNss()}.pdf`);
  }
  body(det) {
    
    let temp = [];
    this.bodyTable=[];
    det.forEach((element, index) => {
      
      let filllcolor = ((index % 2) === 0) ? "#eeeeff" : "#ffffff";
      temp.push(
        {
          text: element.cantidad, border: [true, false, false, false],
          fillColor: filllcolor
        },{
          text: element['idProducto']['nombre'], border: [true, false, false, false],
          fillColor: filllcolor
        },{
          text: element['idProducto']['precio']['$numberDecimal'], border: [true, false, false, false],
          fillColor: filllcolor
        },{
          text: element['subtotal']['$numberDecimal'], border: [true, false, true, false],
          fillColor: filllcolor
        })
        this.bodyTable.push(temp);
        temp=[];
        
    });
    
    

  

  }
  generaNss() {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < charactersLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
}
