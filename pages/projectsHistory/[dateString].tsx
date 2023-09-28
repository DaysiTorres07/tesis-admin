import Router from "next/router";
import { useEffect, useState } from "react";
import LoadingContainer from "../../lib/components/loading_container";
import { useAuth } from "../../lib/hooks/use_auth";
import { Facture, Solicitude } from "../../lib/types";
import { CheckPermissions } from "../../lib/utils/check_permissions";
import HttpClient from "../../lib/utils/http_client";

const GeneralReportProjects = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [solicitudes, setSolicitudes] = useState<
    Map<string, Array<Solicitude>>
  >(new Map());
  const [values, setValues] = useState<Map<string, number>>(new Map());
  const [solicitudesByProjectIc, setSolicitudesByProjectIc] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [solicitudesByProjectIg, setSolicitudesByProjectIg] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [solicitudesByProjectCal, setSolicitudesByProjectCal] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [solicitudesByProjectBal, setSolicitudesByProjectBal] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [solicitudesByProjectRec, setSolicitudesByProjectRec] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [advancesByProjectIc, setAdvancesByProjectIc] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [advancesByProjectIg, setAdvancesByProjectIg] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [advancesByProjectCal, setAdvancesByProjectCal] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [advancesByProjectBal, setAdvancesByProjectBal] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [advancesByProjectRec, setAdvancesByProjectRec] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [busqueda, setBusqueda] = useState("");

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      let value = 0;
      let valueRetention = 0;
      let valueNet = 0;
      let discount = 0;

      let advanceValue = 0;
      let advanceValueRetention = 0;
      let advanceValueNet = 0;
      let advanceDiscount = 0;

      const dateString = Router.query.dateString as string;

      var solicitudesConst: Array<Solicitude> =
        (
          await HttpClient(
            "/api/solicitude?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      solicitudesConst.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          value += facture.value;
          valueRetention += facture.valueRetention;
          valueNet += facture.valueNet;
          discount += facture.discount;
        });
      });

      var solicitudesIg: Array<Solicitude> =
        (
          await HttpClient(
            "/api/solicitudeInmogestion?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      solicitudesIg.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          value += facture.value;
          valueRetention += facture.valueRetention;
          valueNet += facture.valueNet;
          discount += facture.discount;
        });
      });

      var solicitudesCalderon: Array<Solicitude> =
        (
          await HttpClient(
            "/api/solicitudeCalderon?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      solicitudesCalderon.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          value += facture.value;
          valueRetention += facture.valueRetention;
          valueNet += facture.valueNet;
          discount += facture.discount;
        });
      });

      var solicitudesBalcon: Array<Solicitude> =
        (
          await HttpClient(
            "/api/solicitudeBalcon?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      solicitudesBalcon.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          value += facture.value;
          valueRetention += facture.valueRetention;
          valueNet += facture.valueNet;
          discount += facture.discount;
        });
      });

      var solicitudesRecaudaciones: Array<Solicitude> =
        (
          await HttpClient(
            "/api/solicitudeRecaudaciones?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      solicitudesRecaudaciones.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          value += facture.value;
          valueRetention += facture.valueRetention;
          valueNet += facture.valueNet;
          discount += facture.discount;
        });
      });

      var advancesConst: Array<Solicitude> =
        (
          await HttpClient(
            "/api/advance?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      advancesConst.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          advanceValue += facture.value;
          advanceValueRetention += facture.valueRetention;
          advanceValueNet += facture.valueNet;
          advanceDiscount += facture.discount;
        });
      });

      var advancesIg: Array<Solicitude> =
        (
          await HttpClient(
            "/api/advanceInmogestion?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      advancesIg.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          advanceValue += facture.value;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += facture.discount;
          advanceValueNet += facture.valueNet;
        });
      });

      var advancesCalderon: Array<Solicitude> =
        (
          await HttpClient(
            "/api/advanceCaleron?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      advancesCalderon.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          advanceValue += facture.value;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += facture.discount;
          advanceValueNet += facture.valueNet;
        });
      });

      var advancesBalcon: Array<Solicitude> =
        (
          await HttpClient(
            "/api/advanceBalcon?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      advancesBalcon.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          advanceValue += facture.value;
          advanceValueRetention += facture.valueRetention;
          advanceValueNet += facture.valueNet;
          advanceDiscount += facture.discount;
        });
      });

      var advancesRecaudaciones: Array<Solicitude> =
        (
          await HttpClient(
            "/api/advanceRecaudaciones?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      advancesRecaudaciones.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          advanceValue += facture.value;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += facture.discount;
          advanceValueNet += facture.valueNet;
        });
      });

      //Solicitudes y anticipos del historial
      var solicitudesHisConst: Array<Solicitude> =
        (
          await HttpClient(
            "/api/solicitude/solicitudeHistory?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      solicitudesHisConst.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          value += facture.value;
          valueRetention += facture.valueRetention;
          valueNet += facture.valueNet;
          discount += facture.discount;
        });
      });

      var solicitudesHisConst150: Array<Solicitude> =
        (
          await HttpClient(
            "/api/solicitude/solicitudeHistory150-300?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      solicitudesHisConst150.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          value += facture.value;
          valueRetention += facture.valueRetention;
          valueNet += facture.valueNet;
          discount += facture.discount;
        });
      });

      var solicitudesHisIg: Array<Solicitude> =
        (
          await HttpClient(
            "/api/solicitudeInmogestion/solicitudeHistory?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      solicitudesHisIg.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          value += facture.value;
          valueRetention += facture.valueRetention;
          discount += facture.discount;
          valueNet += facture.valueNet;
        });
      });

      var solicitudesHisCalderon: Array<Solicitude> =
        (
          await HttpClient(
            "/api/solicitudeCalderon/solicitudeHistory?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      solicitudesHisCalderon.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          value += facture.value;
          valueRetention += facture.valueRetention;
          discount += facture.discount;
          valueNet += facture.valueNet;
        });
      });

      var solicitudesHisBalcon: Array<Solicitude> =
        (
          await HttpClient(
            "/api/solicitudeBalcon/solicitudeHistory?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      solicitudesHisBalcon.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          value += facture.value;
          valueRetention += facture.valueRetention;
          discount += facture.discount;
          valueNet += facture.valueNet;
        });
      });

      var solicitudesHisRecaudaciones: Array<Solicitude> =
        (
          await HttpClient(
            "/api/solicitudeRecaudaciones/solicitudeHistory?dates=" +
              dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      solicitudesHisRecaudaciones.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          value += facture.value;
          valueRetention += facture.valueRetention;
          valueNet += facture.valueNet;
          discount += facture.discount;
        });
      });

      var advancesHisConst: Array<Solicitude> =
        (
          await HttpClient(
            "/api/advance/advanceHistory?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      advancesHisConst.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          advanceValue += facture.value;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += facture.discount;
          advanceValueNet += facture.valueNet;
        });
      });

      var advancesHisIg: Array<Solicitude> =
        (
          await HttpClient(
            "/api/advanceInmogestion/advanceHistory?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      advancesHisIg.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          advanceValue += facture.value;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += facture.discount;
          advanceValueNet += facture.valueNet;
        });
      });

      var advancesHisCalderon: Array<Solicitude> =
        (
          await HttpClient(
            "/api/advanceCalderon/advanceHistory?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      advancesHisCalderon.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          advanceValue += facture.value;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += facture.discount;
          advanceValueNet += facture.valueNet;
        });
      });

      var advancesHisBalcon: Array<Solicitude> =
        (
          await HttpClient(
            "/api/advanceBalcon/advanceHistory?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      advancesHisBalcon.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          advanceValue += facture.value;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += facture.discount;
          advanceValueNet += facture.valueNet;
        });
      });

      var advancesHisRecaudaciones =
        (
          await HttpClient(
            "/api/advanceRecaudaciones/advanceHistory?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      advancesHisRecaudaciones.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          advanceValue += facture.value;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += facture.discount;
          advanceValueNet += facture.valueNet;
        });
      });

      let concatConst = solicitudesHisConst.concat(
        solicitudesConst,
        solicitudesHisConst150
      );
      let concatIg = solicitudesHisIg.concat(solicitudesIg);
      let concatBalcon = solicitudesBalcon.concat(solicitudesBalcon);
      let concatCalderon = solicitudesHisCalderon.concat(solicitudesCalderon);
      let concatRecaudaciones = solicitudesHisRecaudaciones.concat(
        solicitudesRecaudaciones
      );

      let concatAdvConst = advancesHisConst.concat(advancesConst);
      let concatAdvIg = advancesHisIg.concat(advancesIg);
      let concatAdvCalderon = advancesHisCalderon.concat(advancesCalderon);
      let concatAdvBalcon = advancesHisBalcon.concat(advancesBalcon);
      let concatAdvRecaudaciones = advancesHisRecaudaciones.concat(
        advancesRecaudaciones
      );

      setSolicitudes(
        new Map([
          ["const", concatConst],
          ["ig", concatIg],
          ["calderon", concatCalderon],
          ["balcon", concatBalcon],
          ["recaudaciones", concatRecaudaciones],

          ["adv-const", concatAdvConst],
          ["adv-ig", concatAdvIg],
          ["adv-calderon", concatAdvCalderon],
          ["adv-balcon", concatAdvBalcon],
          ["adv-recaudaciones", concatRecaudaciones],
        ])
      );

      let auxSolicitudesByProjectIc: Map<String, Array<Facture>> = new Map();
      concatConst.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxSolicitudesByProjectIc.keys()).includes(
              facture.project.name
            )
          ) {
            auxSolicitudesByProjectIc.set(facture.project.name, [facture]);
          } else {
            auxSolicitudesByProjectIc.set(facture.project.name, [
              ...auxSolicitudesByProjectIc.get(facture.project.name),
              facture,
            ]);
          }
        });
      });
      setSolicitudesByProjectIc(auxSolicitudesByProjectIc);

      let auxSolicitudesByProjectIg: Map<String, Array<Facture>> = new Map();
      concatIg.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxSolicitudesByProjectIg.keys()).includes(
              facture.project.name
            )
          ) {
            auxSolicitudesByProjectIg.set(facture.project.name, [facture]);
          } else {
            auxSolicitudesByProjectIg.set(facture.project.name, [
              ...auxSolicitudesByProjectIg.get(facture.project.name),
              facture,
            ]);
          }
        });
      });
      setSolicitudesByProjectIg(auxSolicitudesByProjectIg);

      let auxSolicitudesByProjectCal: Map<String, Array<Facture>> = new Map();
      concatCalderon.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxSolicitudesByProjectCal.keys()).includes(
              facture.project.name
            )
          ) {
            auxSolicitudesByProjectCal.set(facture.project.name, [facture]);
          } else {
            auxSolicitudesByProjectCal.set(facture.project.name, [
              ...auxSolicitudesByProjectCal.get(facture.project.name),
              facture,
            ]);
          }
        });
      });
      setSolicitudesByProjectCal(auxSolicitudesByProjectCal);

      let auxSolicitudesByProjectBal: Map<String, Array<Facture>> = new Map();
      concatBalcon.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxSolicitudesByProjectBal.keys()).includes(
              facture.project.name
            )
          ) {
            auxSolicitudesByProjectBal.set(facture.project.name, [facture]);
          } else {
            auxSolicitudesByProjectBal.set(facture.project.name, [
              ...auxSolicitudesByProjectBal.get(facture.project.name),
              facture,
            ]);
          }
        });
      });
      setSolicitudesByProjectBal(auxSolicitudesByProjectBal);

      let auxSolicitudesByProjectRec: Map<String, Array<Facture>> = new Map();
      concatRecaudaciones.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxSolicitudesByProjectRec.keys()).includes(
              facture.project.name
            )
          ) {
            auxSolicitudesByProjectRec.set(facture.project.name, [facture]);
          } else {
            auxSolicitudesByProjectRec.set(facture.project.name, [
              ...auxSolicitudesByProjectRec.get(facture.project.name),
              facture,
            ]);
          }
        });
      });
      setSolicitudesByProjectRec(auxSolicitudesByProjectRec);

      let auxAdvancesByProjectIc: Map<String, Array<Facture>> = new Map();
      concatAdvConst.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxAdvancesByProjectIc.keys()).includes(
              facture.project.name
            )
          ) {
            auxAdvancesByProjectIc.set(facture.project.name, [facture]);
          } else {
            auxAdvancesByProjectIc.set(facture.project.name, [
              ...auxAdvancesByProjectIc.get(facture.project.name),
              facture,
            ]);
          }
        });
      });
      setAdvancesByProjectIc(auxAdvancesByProjectIc);

      let auxAdvancesByProjectIg: Map<String, Array<Facture>> = new Map();
      concatAdvIg.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxAdvancesByProjectIg.keys()).includes(
              facture.project.name
            )
          ) {
            auxAdvancesByProjectIg.set(facture.project.name, [facture]);
          } else {
            auxAdvancesByProjectIg.set(facture.project.name, [
              ...auxAdvancesByProjectIg.get(facture.project.name),
              facture,
            ]);
          }
        });
      });
      setAdvancesByProjectIg(auxAdvancesByProjectIg);

      let auxAdvancesByProjectCal: Map<String, Array<Facture>> = new Map();
      concatAdvCalderon.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxAdvancesByProjectCal.keys()).includes(
              facture.project.name
            )
          ) {
            auxAdvancesByProjectCal.set(facture.project.name, [facture]);
          } else {
            auxAdvancesByProjectCal.set(facture.project.name, [
              ...auxAdvancesByProjectCal.get(facture.project.name),
              facture,
            ]);
          }
        });
      });
      setAdvancesByProjectCal(auxAdvancesByProjectCal);

      let auxAdvancesByProjectBal: Map<String, Array<Facture>> = new Map();
      concatAdvBalcon.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxAdvancesByProjectBal.keys()).includes(
              facture.project.name
            )
          ) {
            auxAdvancesByProjectBal.set(facture.project.name, [facture]);
          } else {
            auxAdvancesByProjectBal.set(facture.project.name, [
              ...auxAdvancesByProjectBal.get(facture.project.name),
              facture,
            ]);
          }
        });
      });
      setAdvancesByProjectBal(auxAdvancesByProjectBal);

      let auxAdvancesByProjectRec: Map<String, Array<Facture>> = new Map();
      concatAdvRecaudaciones.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxAdvancesByProjectRec.keys()).includes(
              facture.project.name
            )
          ) {
            auxAdvancesByProjectRec.set(facture.project.name, [facture]);
          } else {
            auxAdvancesByProjectRec.set(facture.project.name, [
              ...auxAdvancesByProjectRec.get(facture.project.name),
              facture,
            ]);
          }
        });
      });
      setAdvancesByProjectRec(auxAdvancesByProjectRec);

      setLoading(true);
    } else {
      setTimeout(loadData, 1000);
    }
  };

  const filterByProjects = (
    solicitudes: Map<String, Array<Facture>>
  ): Map<String, Array<Facture>> => {
    const filtered: Map<String, Array<Facture>> = new Map();
    solicitudes.forEach((facture: Array<Facture>, project: string) => {
      const filteredFactures: Array<Facture> = facture.filter(
        (item) =>
          item.project.name.toLowerCase() === busqueda.toLowerCase() ||
          item.project.name.toLowerCase().includes(busqueda.toLowerCase())
      );
      if (filteredFactures.length > 0) {
        filtered.set(project, filteredFactures);
      }
    });
    return filtered;
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSoliciter = (
    arraySolicitude: Array<Solicitude>,
    factureId: string | undefined
  ): string => {
    let solicitudeFound = (arraySolicitude ?? []).filter(
      (solicitude: Solicitude) =>
        solicitude.items.some((facture: Facture) => facture.id === factureId)
    );
    return solicitudeFound[0]?.soliciter ?? "";
  };

  const getSolicitudeNumber = (
    arraySolicitude: Array<Solicitude>,
    factureId: string | undefined
  ): number => {
    let solicitudeFound = (arraySolicitude ?? []).filter(
      (solicitude: Solicitude) =>
        solicitude.items.some((facture: Facture) => facture.id === factureId)
    );
    return solicitudeFound[0]?.number;
  };

  const getSolicitudeDate = (
    arraySolicitude: Array<Solicitude>,
    factureId: string | undefined
  ): string => {
    let solicitudeFound = (arraySolicitude ?? []).filter(
      (solicitude: Solicitude) =>
        solicitude.items.some((facture: Facture) => facture.id === factureId)
    );
    return solicitudeFound[0]?.date ?? "";
  };

  const projectFacturesTotal = (
    factures: Array<Facture>,
    project: string
  ): JSX.Element => {
    let value = 0;
    let valueRetention = 0;
    let valueNet = 0;
    let discount = 0;
    factures.forEach((facture: Facture) => {
      value += facture.value;
      valueRetention += facture.valueRetention;
      valueNet += facture.valueNet;
      discount += facture.discount;
    });
    return (
      <>
        <th
          colSpan={9}
          style={{
            border: "1px solid",
            textAlign: "center",
            backgroundColor: "#aed6f1",
          }}
        >
          TOTAL {project}
        </th>
        <th
          style={{
            border: "1px solid",
            backgroundColor: "#aed6f1",
          }}
        >
          ${(value ?? "").toLocaleString()}
        </th>
        <th style={{ border: "1px solid", backgroundColor: "#aed6f1" }}>
          ${(valueRetention ?? "").toLocaleString()}
        </th>
        <th
          style={{
            border: "1px solid",
            backgroundColor: "#aed6f1",
          }}
        >
          ${(valueNet ?? "").toLocaleString()}
        </th>
      </>
    );
  };

  const projectFacturesTotalr = (
    factures: Array<Facture>,
    project: string
  ): JSX.Element => {
    let value = 0;
    let valueRetention = 0;
    let valueNet = 0;
    let discount = 0;
    factures.forEach((facture: Facture) => {
      value += facture.value;
      valueRetention += facture.valueRetention;
      valueNet += facture.valueNet;
      discount += facture.discount;
    });
    return (
      <>
        <th
          colSpan={8}
          style={{
            border: "1px solid",
            textAlign: "center",
            backgroundColor: "#aed6f1",
          }}
        >
          TOTAL {project}
        </th>
        <th
          style={{
            border: "1px solid",
            backgroundColor: "#aed6f1",
          }}
        >
          ${(value ?? "").toLocaleString()}
        </th>
        {CheckPermissions(auth, [0, 2, 9]) && (
          <th style={{ border: "1px solid", backgroundColor: "#aed6f1" }}>
            ${(valueRetention ?? "").toLocaleString()}
          </th>
        )}
        {CheckPermissions(auth, [0, 2, 9]) && (
          <th
            style={{
              border: "1px solid",
              backgroundColor: "#aed6f1",
            }}
          >
            ${(valueNet ?? "").toLocaleString()}
          </th>
        )}
      </>
    );
  };

  const getSolicitudesByProjectsIc = (
    arraySolicitude: Array<Solicitude>,
    arrayByProject: Map<String, Facture[]>
  ): Array<JSX.Element> => {
    const jsxArray: Array<JSX.Element> = [];
    arrayByProject.forEach((factures: Array<Facture>, project: string) => {
      jsxArray.push(
        <>
          <tbody key={project}>
            {(factures ?? []).map((item: Facture, index: number) => {
              return (
                <tr style={{ textAlign: "center" }} key={index}>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 40,
                    }}
                  >
                    {getSolicitudeNumber(arraySolicitude, item.id)}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 71,
                    }}
                  >
                    {getSolicitudeDate(arraySolicitude, item.id).substring(
                      0,
                      10
                    )}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 71,
                    }}
                  >
                    {getSoliciter(arraySolicitude, item.id)}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 140,
                    }}
                  >
                    {item.project.name ?? " "}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 400,
                    }}
                  >
                    {item.centerCost.name ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 400,
                    }}
                  >
                    {item.provider.name ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 80,
                    }}
                  >
                    {item.factureDate ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid ",
                      padding: "0.25em",
                      width: 60,
                    }}
                  >
                    {item.factureNumber ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      width: 420,
                      textAlign: "left",
                      padding: "0.25em",
                    }}
                  >
                    {item.details ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 60,
                    }}
                  >
                    {(item.value ?? "").toLocaleString()}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 50,
                    }}
                  >
                    {(item.valueRetention ?? "").toLocaleString()}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 60,
                    }}
                  >
                    {(item.valueNet ?? "").toLocaleString()}
                  </td>
                </tr>
              );
            })}
            <tr
              style={{
                border: "1px solid",
                textAlign: "center",
              }}
            >
              {projectFacturesTotal(factures, project)}
            </tr>
          </tbody>
          <br />
        </>
      );
    });
    return jsxArray;
  };

  const getSolicitudesByProjectIg = (
    arraySolicitude: Array<Solicitude>,
    arrayByProject: Map<String, Facture[]>,
    recaudaciones: boolean = false
  ): Array<JSX.Element> => {
    const jsxArray: Array<JSX.Element> = [];
    arrayByProject.forEach((factures: Array<Facture>, project: string) => {
      jsxArray.push(
        <>
          <tbody key={project}>
            {(factures ?? []).map((itemIgFac: Facture, factureIg: number) => {
              return (
                <tr
                  style={{
                    textAlign: "center",
                  }}
                  key={factureIg}
                >
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 40,
                    }}
                  >
                    {getSolicitudeNumber(arraySolicitude, itemIgFac.id)}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 71,
                    }}
                  >
                    {getSolicitudeDate(arraySolicitude, itemIgFac.id).substring(
                      0,
                      10
                    )}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 71,
                    }}
                  >
                    {getSoliciter(arraySolicitude, itemIgFac.id)}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 140,
                    }}
                  >
                    {itemIgFac.project.name ?? ""}
                  </td>
                  {!recaudaciones && (
                    <td
                      style={{
                        border: "1px solid",
                        padding: "0.25em",
                        width: 400,
                      }}
                    >
                      {itemIgFac.centerCostIg.name ?? ""}
                    </td>
                  )}
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 400,
                    }}
                  >
                    {itemIgFac.providerIg.name ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 80,
                    }}
                  >
                    {itemIgFac.factureDate ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid ",
                      padding: "0.25em",
                      width: 60,
                    }}
                  >
                    {itemIgFac.factureNumber ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      width: 420,
                      textAlign: "left",
                      padding: "0.25em",
                    }}
                  >
                    {itemIgFac.details ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 60,
                    }}
                  >
                    {(itemIgFac.value ?? "").toLocaleString()}
                  </td>
                  {CheckPermissions(auth, [0, 2, 9]) && (
                    <td
                      style={{
                        border: "1px solid",
                        padding: "0.25em",
                        width: 50,
                      }}
                    >
                      {(itemIgFac.valueRetention ?? "").toLocaleString()}
                    </td>
                  )}
                  {CheckPermissions(auth, [0, 2, 9]) && (
                    <td
                      style={{
                        border: "1px solid",
                        padding: "0.25em",
                        width: 60,
                      }}
                    >
                      {(itemIgFac.valueNet ?? "").toLocaleString()}
                    </td>
                  )}
                </tr>
              );
            })}
            <tr
              style={{
                border: "1px solid",
                textAlign: "center",
              }}
            >
              {projectFacturesTotal(factures, "IG")}
            </tr>
          </tbody>
        </>
      );
    });
    return jsxArray;
  };

  const getSolicitudesByProjectCal = (
    arraySolicitude: Array<Solicitude>,
    arrayByProject: Map<String, Facture[]>,
    recaudaciones: boolean = false
  ): Array<JSX.Element> => {
    const jsxArray: Array<JSX.Element> = [];
    arrayByProject.forEach((factures: Array<Facture>, project: string) => {
      jsxArray.push(
        <>
          <tbody key={project}>
            {(factures ?? []).map((itemIgFac: Facture, factureIg: number) => {
              return (
                <tr
                  style={{
                    textAlign: "center",
                  }}
                  key={factureIg}
                >
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 40,
                    }}
                  >
                    {getSolicitudeNumber(arraySolicitude, itemIgFac.id)}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 71,
                    }}
                  >
                    {getSolicitudeDate(arraySolicitude, itemIgFac.id).substring(
                      0,
                      10
                    )}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 71,
                    }}
                  >
                    {getSoliciter(arraySolicitude, itemIgFac.id)}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 140,
                    }}
                  >
                    {itemIgFac.project.name ?? ""}
                  </td>
                  {!recaudaciones && (
                    <td
                      style={{
                        border: "1px solid",
                        padding: "0.25em",
                        width: 400,
                      }}
                    >
                      {itemIgFac.centerCostCalderon.name ?? ""}
                    </td>
                  )}
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 400,
                    }}
                  >
                    {itemIgFac.providerCalderon.name ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 80,
                    }}
                  >
                    {itemIgFac.factureDate ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid ",
                      padding: "0.25em",
                      width: 60,
                    }}
                  >
                    {itemIgFac.factureNumber ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      width: 420,
                      textAlign: "left",
                      padding: "0.25em",
                    }}
                  >
                    {itemIgFac.details ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 60,
                    }}
                  >
                    {(itemIgFac.value ?? "").toLocaleString()}
                  </td>
                  {CheckPermissions(auth, [0, 2, 9]) && (
                    <td
                      style={{
                        border: "1px solid",
                        padding: "0.25em",
                        width: 50,
                      }}
                    >
                      {(itemIgFac.valueRetention ?? "").toLocaleString()}
                    </td>
                  )}
                  {CheckPermissions(auth, [0, 2, 9]) && (
                    <td
                      style={{
                        border: "1px solid",
                        padding: "0.25em",
                        width: 60,
                      }}
                    >
                      {(itemIgFac.valueNet ?? "").toLocaleString()}
                    </td>
                  )}
                </tr>
              );
            })}
            <tr
              style={{
                border: "1px solid",
                textAlign: "center",
              }}
            >
              {projectFacturesTotal(factures, "CALDERON")}
            </tr>
          </tbody>
        </>
      );
    });
    return jsxArray;
  };

  const getSolicitudesByProjectBal = (
    arraySolicitude: Array<Solicitude>,
    arrayByProject: Map<String, Facture[]>,
    recaudaciones: boolean = false
  ): Array<JSX.Element> => {
    const jsxArray: Array<JSX.Element> = [];
    arrayByProject.forEach((factures: Array<Facture>, project: string) => {
      jsxArray.push(
        <>
          <tbody key={project}>
            {(factures ?? []).map((itemIgFac: Facture, factureIg: number) => {
              return (
                <tr
                  style={{
                    textAlign: "center",
                  }}
                  key={factureIg}
                >
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 40,
                    }}
                  >
                    {getSolicitudeNumber(arraySolicitude, itemIgFac.id)}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 71,
                    }}
                  >
                    {getSolicitudeDate(arraySolicitude, itemIgFac.id).substring(
                      0,
                      10
                    )}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 71,
                    }}
                  >
                    {getSoliciter(arraySolicitude, itemIgFac.id)}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 140,
                    }}
                  >
                    {itemIgFac.project.name ?? ""}
                  </td>
                  {!recaudaciones && (
                    <td
                      style={{
                        border: "1px solid",
                        padding: "0.25em",
                        width: 400,
                      }}
                    >
                      {itemIgFac.centerCostBalcon.name ?? ""}
                    </td>
                  )}
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 400,
                    }}
                  >
                    {itemIgFac.providerBalcon.name ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 80,
                    }}
                  >
                    {itemIgFac.factureDate ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid ",
                      padding: "0.25em",
                      width: 60,
                    }}
                  >
                    {itemIgFac.factureNumber ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      width: 420,
                      textAlign: "left",
                      padding: "0.25em",
                    }}
                  >
                    {itemIgFac.details ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 60,
                    }}
                  >
                    {(itemIgFac.value ?? "").toLocaleString()}
                  </td>
                  {CheckPermissions(auth, [0, 2, 9]) && (
                    <td
                      style={{
                        border: "1px solid",
                        padding: "0.25em",
                        width: 50,
                      }}
                    >
                      {(itemIgFac.valueRetention ?? "").toLocaleString()}
                    </td>
                  )}
                  {CheckPermissions(auth, [0, 2, 9]) && (
                    <td
                      style={{
                        border: "1px solid",
                        padding: "0.25em",
                        width: 60,
                      }}
                    >
                      {(itemIgFac.valueNet ?? "").toLocaleString()}
                    </td>
                  )}
                </tr>
              );
            })}
            <tr
              style={{
                border: "1px solid",
                textAlign: "center",
              }}
            >
              {projectFacturesTotal(factures, "BALCON")}
            </tr>
          </tbody>
        </>
      );
    });
    return jsxArray;
  };

  const getSolicitudesProjectRec = (
    arraySolicitude: Array<Solicitude>,
    arrayByProject: Map<String, Facture[]>,
    recaudaciones: boolean = false
  ): Array<JSX.Element> => {
    const jsxArray: Array<JSX.Element> = [];
    arrayByProject.forEach((factures: Array<Facture>, project: string) => {
      jsxArray.push(
        <>
          <tbody key={project}>
            {(factures ?? []).map((itemIgFac: Facture, factureIg: number) => {
              return (
                <tr
                  style={{
                    textAlign: "center",
                  }}
                  key={factureIg}
                >
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 40,
                    }}
                  >
                    {getSolicitudeNumber(arraySolicitude, itemIgFac.id)}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 71,
                    }}
                  >
                    {getSolicitudeDate(arraySolicitude, itemIgFac.id).substring(
                      0,
                      10
                    )}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 71,
                    }}
                  >
                    {getSoliciter(arraySolicitude, itemIgFac.id)}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 140,
                    }}
                  >
                    {itemIgFac.project.name ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 400,
                    }}
                  >
                    {itemIgFac.providerRecaudaciones.name ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 80,
                    }}
                  >
                    {itemIgFac.factureDate ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid ",
                      padding: "0.25em",
                      width: 60,
                    }}
                  >
                    {itemIgFac.factureNumber ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      width: 420,
                      textAlign: "left",
                      padding: "0.25em",
                    }}
                  >
                    {itemIgFac.details ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 60,
                    }}
                  >
                    {(itemIgFac.value ?? "").toLocaleString()}
                  </td>
                  {CheckPermissions(auth, [0, 2, 9]) && (
                    <td
                      style={{
                        border: "1px solid",
                        padding: "0.25em",
                        width: 50,
                      }}
                    >
                      {(itemIgFac.valueRetention ?? "").toLocaleString()}
                    </td>
                  )}
                  {CheckPermissions(auth, [0, 2, 9]) && (
                    <td
                      style={{
                        border: "1px solid",
                        padding: "0.25em",
                        width: 60,
                      }}
                    >
                      {(itemIgFac.valueNet ?? "").toLocaleString()}
                    </td>
                  )}
                </tr>
              );
            })}
            <tr
              style={{
                border: "1px solid",
                textAlign: "center",
              }}
            >
              {projectFacturesTotalr(factures, "RECAUDACIONES")}
            </tr>
          </tbody>
        </>
      );
    });
    return jsxArray;
  };

  const fecha = Router.query.dateString;

  return (
    <>
      <title>Reporte de Proyectos</title>

      <LoadingContainer visible={!loading}>
        <style>
          {`
            body {
              background-color: white !important;
            }
         `}
        </style>
        <h2 className="text-center my-4 mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
          REPORTE DE PROYECTOS {fecha}
        </h2>
        <div className="flex justify-center items-center">
          <div className="w-full sm:w-auto bg-white rounded-lg shadow p-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-search text-gray-400 mr-2"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
            <input
              className="border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Filtro de Búsqueda"
            />
          </div>
        </div>
        <h3 className="text-center text-xl my-4 mb-4 font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">
          SOLICITUDES
        </h3>
        <div style={{ width: "100%", fontSize: "11px" }} className="mx-auto">
          {(solicitudes.get("const") ?? []).length !== 0 && (
            <>
              <div className="mx-4">
                <table className="" style={{ width: "100%" }}></table>
              </div>
              <div id="const" className="mx-4">
                <table className="p-1" width={"100%"}>
                  <thead>
                    <tr
                      style={{
                        border: "1px solid",
                        textAlign: "center",
                        background: "#8c4343",
                      }}
                    >
                      <th style={{ width: 40 }}>#</th>
                      <th style={{ width: 71 }}>Fecha</th>
                      <th style={{ width: 71 }}>Solicitante</th>
                      <th style={{ width: 140 }}>Proyecto</th>
                      <th style={{ width: 400 }}>Centro de Costos</th>
                      <th style={{ width: 400 }}>Proveedor</th>
                      <th style={{ width: 80 }}>Fecha fac</th>
                      <th style={{ width: 60 }}># Factura</th>
                      <th
                        style={{
                          width: 420,
                        }}
                      >
                        Detalle
                      </th>
                      <th style={{ width: 60 }}>Valor</th>
                      <th style={{ width: 50 }}>Retencion</th>
                      <th style={{ width: 60 }}>Pagado</th>
                    </tr>
                  </thead>
                  {getSolicitudesByProjectsIc(
                    solicitudes.get("const"),
                    busqueda.length > 0
                      ? filterByProjects(solicitudesByProjectIc)
                      : solicitudesByProjectIc
                  )}
                </table>
              </div>
            </>
          )}

          {(solicitudes.get("ig") ?? []).length !== 0 && (
            <>
              <div id="ig" className="mx-4">
                <table className="p-1" width={"100%"}>
                  {getSolicitudesByProjectIg(
                    solicitudes.get("ig"),
                    busqueda.length > 0
                      ? filterByProjects(solicitudesByProjectIg)
                      : solicitudesByProjectIg
                  )}
                </table>
              </div>
              <br />
            </>
          )}

          {(solicitudes.get("calderon") ?? []).length !== 0 && (
            <>
              <div id="calderon" className="mx-4">
                <table className="p-1" width={"100%"}>
                  {getSolicitudesByProjectCal(
                    solicitudes.get("calderon"),
                    busqueda.length > 0
                      ? filterByProjects(solicitudesByProjectCal)
                      : solicitudesByProjectCal
                  )}
                </table>
              </div>
              <br />
            </>
          )}

          {(solicitudes.get("balcon") ?? []).length !== 0 && (
            <>
              <div id="balcon" className="mx-4">
                <table className="p-1" width={"100%"}>
                  {getSolicitudesByProjectBal(
                    solicitudes.get("balcon"),
                    busqueda.length > 0
                      ? filterByProjects(solicitudesByProjectBal)
                      : solicitudesByProjectBal
                  )}
                </table>
              </div>
              <br />
            </>
          )}

          {(solicitudes.get("recaudaciones") ?? []).length !== 0 && (
            <>
              <div id="recaudaciones" className="mx-4">
                <table className="p-1" width={"100%"}>
                  {getSolicitudesProjectRec(
                    solicitudes.get("recaudaciones"),
                    busqueda.length > 0
                      ? filterByProjects(solicitudesByProjectRec)
                      : solicitudesByProjectRec
                  )}
                </table>
              </div>
              <br />
            </>
          )}

          <h3 className="text-center text-xl my-4 mb-4 font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">
            ANTICIPOS
          </h3>
          {(solicitudes.get("adv-const") ?? []).length !== 0 && (
            <>
              <div id="adv-const" className="mx-4">
                <table className="p-1" width={"100%"}>
                  {getSolicitudesByProjectsIc(
                    solicitudes.get("adv-const"),
                    busqueda.length > 0
                      ? filterByProjects(advancesByProjectIc)
                      : advancesByProjectIc
                  )}
                </table>
              </div>
            </>
          )}

          {(solicitudes.get("adv-ig") ?? []).length !== 0 && (
            <>
              <div id="adv-ig" className="mx-4">
                <table className="p-1" width={"100%"}>
                  {getSolicitudesByProjectIg(
                    solicitudes.get("adv-ig"),
                    busqueda.length > 0
                      ? filterByProjects(advancesByProjectIg)
                      : advancesByProjectIg
                  )}
                </table>
              </div>
            </>
          )}

          {(solicitudes.get("adv-calderon") ?? []).length !== 0 && (
            <>
              <div id="adv-calderon" className="mx-4">
                <table className="p-1" width={"100%"}>
                  {getSolicitudesByProjectCal(
                    solicitudes.get("adv-calderon"),
                    busqueda.length > 0
                      ? filterByProjects(advancesByProjectCal)
                      : advancesByProjectCal
                  )}
                </table>
              </div>
            </>
          )}

          {(solicitudes.get("adv-balcon") ?? []).length !== 0 && (
            <>
              <div id="adv-balcon" className="mx-4">
                <table className="p-1" width={"100%"}>
                  {getSolicitudesByProjectBal(
                    solicitudes.get("adv-balcon"),
                    busqueda.length > 0
                      ? filterByProjects(advancesByProjectBal)
                      : advancesByProjectBal
                  )}
                </table>
              </div>
            </>
          )}

          {(solicitudes.get("adv-recaudaciones") ?? []).length !== 0 && (
            <>
              <div id="adv-recaudaciones" className="mx-4">
                <table className="p-1" width={"100%"}>
                  {getSolicitudesProjectRec(
                    solicitudes.get("adv-recaudaciones"),
                    busqueda.length > 0
                      ? filterByProjects(advancesByProjectRec)
                      : advancesByProjectRec
                  )}
                </table>
              </div>
            </>
          )}
        </div>
      </LoadingContainer>
    </>
  );
};

export default GeneralReportProjects;
