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
    to: "gestionycobranza@grupoancon.com",
    subject: `Notificación Sistema de Solicitudes y Anticipos de pagos (SAP)`,
    html: `
          <div>
          <p>Estimado/a: <strong>Pilar</strong></p>
          <p>Tiene una Tarea que realizar en el Sistema de <strong>Solicitudes y Anticipos (SAP)</strong></p> 
          <p>https://solicitudes.grupoancon.com/</p>
          <h4>DETALLE:</h4>
          <p>El financiero/a culmino su tarea del Anticipo N°: <strong>${req.body.number}</strong>, de la empresa <strong>RECAUDACIONES</strong>, por el Usuario: <strong>Daniela</strong>, realizar las tareas correspondientes.</p>
          <p>Recuerde que podemos colocar estados en cada Anticipo</p>
            <li>PENDIENTE</li>
            <li>PROCESANDO</li>
            <li>TERMINADO/APROBADO</li>
          <p>No olvidar que cuando termine sus tareas pendientes, colocar su estado en
          APROBADO</p>  
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
