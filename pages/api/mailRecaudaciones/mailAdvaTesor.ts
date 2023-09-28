import FormatedDate from "../../../lib/utils/formated_date";

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: { body: { number: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { status: string; }): void; new(): any; }; }; }) {
  let nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.titan.email",
    auth: {
      user: "notificaciones@grupoancon.com",
      pass: "Not2022*anc",
    },
    secure: true,
       
  });
  const date = FormatedDate()
  const mailData = {
    from: "notificaciones@grupoancon.com",
    to: "vnavas@grupoancon.com",
    subject: `Notificación Sistema de Solicitudes y Anticipos de pagos (SAP)`,
    html: `
          <div>
          <p>Estimado/a: <strong>Valeria</strong></p>
          <p>Tiene una Tarea que realizar en el Sistema de <strong>Solicitudes y Anticipos (SAP)</strong></p> 
          <p>https://solicitudes.grupoancon.com/</p>
          <h4>DETALLE:</h4>
          <p>Tesorería culmino su tarea del Anticipo N°: <strong>${req.body.number}</strong>, de la empresa <strong>RECAUDACIONES</strong>, por el Usuario: <strong>Pilar</strong>, realizar las tareas correspondientes.</p>
          <p>Recuerde que podemos colocar estados en cada Anticipo</p>
            <li>ABIERTO</li>
            <li>CERRADO</li>
          <p>No olvidar que para cerrar un anticipo debera colocar su estado en CERRADO</p>  
          <p>RECIBIDO EL: ${date}</p>
          </div>
          `,
  };
  transporter.sendMail(mailData, function (err: any, info: any) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
  res.status(200).json({ status: "OK" });
}
