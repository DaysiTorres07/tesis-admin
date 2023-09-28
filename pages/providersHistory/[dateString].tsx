import { useEffect, useState } from "react";
import HttpClient from "../../lib/utils/http_client";
import { useAuth } from "../../lib/hooks/use_auth";
import Router from "next/router";
import { Facture, Solicitude } from "../../lib/types";
import LoadingContainer from "../../lib/components/loading_container";
import { CheckPermissions } from "../../lib/utils/check_permissions";

const GeneralReportProvider = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [solicitudes, setSolicitudes] = useState<
    Map<string, Array<Solicitude>>
  >(new Map());
  const [values, setValues] = useState<Map<string, number>>(new Map());
  const [solicitudesByProject, setSolicitudesByProject] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [solicitudesByProjectIg, setSolicitudesByProjectIg] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [solicitudesByProjectCalderon, setSolicitudesByProjectCalderon] =
    useState<Map<String, Array<Facture>>>(new Map());
  const [solicitudesByProjectB, setSolicitudesByProjectB] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [solicitudesByProjectR, setSolicitudesByProjectR] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [advancesByProject, setAdvancesByProject] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [advancesByProjectIg, setAdvancesByProjectIg] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [advancesByProjectC, setAdvancesByProjectC] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [advancesByProjectB, setAdvancesByProjectB] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [advancesByProjectR, setAdvancesByProjectR] = useState<
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

      //Solicitudes y anticipos sin terminar
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
          discount += facture.discount;
          valueNet += facture.valueNet;
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
          advanceDiscount += facture.discount;
          advanceValueNet += facture.valueNet;
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
            "/api/advanceCalderon?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      advancesCalderon.forEach((solicitude: Solicitude) => {
        solicitude.items.forEach((facture: Facture) => {
          advanceValue += facture.value;
          advanceValueRetention += facture.valueRetention;
          advanceValueNet += facture.valueNet;
          advanceDiscount += facture.discount;
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
          advanceDiscount += facture.discount;
          advanceValueNet += facture.valueNet;
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
      let concatCalderon = solicitudesHisCalderon.concat(solicitudesCalderon);
      let concatBalcon = solicitudesHisBalcon.concat(solicitudesBalcon);
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
          ["adv-recaudaciones", concatAdvRecaudaciones],
        ])
      );

      setValues(
        new Map([
          ["value", value],
          ["valueRetention", valueRetention],
          ["discount", discount],
          ["valueNet", valueNet],

          ["adv-value", advanceValue],
          ["adv-valueRetention", advanceValueRetention],
          ["adv-discount", advanceDiscount],
          ["adv-valueNet", advanceValueNet],
        ])
      );

      let auxSolicitudesByProject: Map<String, Array<Facture>> = new Map();
      concatConst.forEach((solicitude: Solicitude) =>
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxSolicitudesByProject.keys()).includes(
              facture.project.name
            )
          ) {
            auxSolicitudesByProject.set(facture.project.name, [facture]);
          } else {
            auxSolicitudesByProject.set(facture.project.name, [
              ...auxSolicitudesByProject.get(facture.project.name),
              facture,
            ]);
          }
        })
      );
      setSolicitudesByProject(auxSolicitudesByProject);

      let auxSolicitudesByProjectIG: Map<String, Array<Facture>> = new Map();
      concatIg.forEach((solicitude: Solicitude) =>
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxSolicitudesByProjectIG.keys()).includes(
              facture.project.name
            )
          ) {
            auxSolicitudesByProjectIG.set(facture.project.name, [facture]);
          } else {
            auxSolicitudesByProjectIG.set(facture.project.name, [
              ...auxSolicitudesByProjectIG.get(facture.project.name),
              facture,
            ]);
          }
        })
      );
      setSolicitudesByProjectIg(auxSolicitudesByProjectIG);

      let auxSolicitudesByProjectCalderon: Map<
        String,
        Array<Facture>
      > = new Map();
      concatCalderon.forEach((solicitude: Solicitude) =>
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxSolicitudesByProjectCalderon.keys()).includes(
              facture.project.name
            )
          ) {
            auxSolicitudesByProjectCalderon.set(facture.project.name, [
              facture,
            ]);
          } else {
            auxSolicitudesByProjectCalderon.set(facture.project.name, [
              ...auxSolicitudesByProjectCalderon.get(facture.project.name),
              facture,
            ]);
          }
        })
      );
      setSolicitudesByProjectCalderon(auxSolicitudesByProjectCalderon);

      let auxSolicitudesByProjectB: Map<String, Array<Facture>> = new Map();
      concatBalcon.forEach((solicitude: Solicitude) =>
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxSolicitudesByProjectB.keys()).includes(
              facture.project.name
            )
          ) {
            auxSolicitudesByProjectB.set(facture.project.name, [facture]);
          } else {
            auxSolicitudesByProjectB.set(facture.project.name, [
              ...auxSolicitudesByProjectB.get(facture.project.name),
              facture,
            ]);
          }
        })
      );
      setSolicitudesByProjectB(auxSolicitudesByProjectB);

      let auxSolicitudesByProjectR: Map<String, Array<Facture>> = new Map();
      concatRecaudaciones.forEach((solicitude: Solicitude) =>
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxSolicitudesByProjectR.keys()).includes(
              facture.project.name
            )
          ) {
            auxSolicitudesByProjectR.set(facture.project.name, [facture]);
          } else {
            auxSolicitudesByProjectR.set(facture.project.name, [
              ...auxSolicitudesByProjectR.get(facture.project.name),
              facture,
            ]);
          }
        })
      );
      setSolicitudesByProjectR(auxSolicitudesByProjectR);

      let auxAdvancesByProjectIg: Map<String, Array<Facture>> = new Map();
      concatAdvIg.forEach((solicitude: Solicitude) =>
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
        })
      );
      setAdvancesByProjectIg(auxAdvancesByProjectIg);

      let auxAdvancesByProjectC: Map<String, Array<Facture>> = new Map();
      concatAdvCalderon.forEach((solicitude: Solicitude) =>
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxAdvancesByProjectC.keys()).includes(
              facture.project.name
            )
          ) {
            auxAdvancesByProjectC.set(facture.project.name, [facture]);
          } else {
            auxAdvancesByProjectC.set(facture.project.name, [
              ...auxAdvancesByProjectC.get(facture.project.name),
              facture,
            ]);
          }
        })
      );
      setAdvancesByProjectC(auxAdvancesByProjectC);

      let auxAdvancesByProjectB: Map<String, Array<Facture>> = new Map();
      concatAdvBalcon.forEach((solicitude: Solicitude) =>
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxAdvancesByProjectB.keys()).includes(
              facture.project.name
            )
          ) {
            auxAdvancesByProjectB.set(facture.project.name, [facture]);
          } else {
            auxAdvancesByProjectB.set(facture.project.name, [
              ...auxAdvancesByProjectB.get(facture.project.name),
              facture,
            ]);
          }
        })
      );
      setAdvancesByProjectB(auxAdvancesByProjectB);

      let auxAdvancesByProjectR: Map<String, Array<Facture>> = new Map();
      concatAdvRecaudaciones.forEach((solicitude: Solicitude) =>
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxAdvancesByProjectR.keys()).includes(
              facture.project.name
            )
          ) {
            auxAdvancesByProjectR.set(facture.project.name, [facture]);
          } else {
            auxAdvancesByProjectR.set(facture.project.name, [
              ...auxAdvancesByProjectR.get(facture.project.name),
              facture,
            ]);
          }
        })
      );
      setAdvancesByProjectR(auxAdvancesByProjectR);

      let auxAdvancesByProject: Map<String, Array<Facture>> = new Map();
      concatAdvConst.forEach((solicitude: Solicitude) =>
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxAdvancesByProject.keys()).includes(
              facture.project.name
            )
          ) {
            auxAdvancesByProject.set(facture.project.name, [facture]);
          } else {
            auxAdvancesByProject.set(facture.project.name, [
              ...auxAdvancesByProject.get(facture.project.name),
              facture,
            ]);
          }
        })
      );
      setAdvancesByProject(auxAdvancesByProject);

      setLoading(true);
    } else {
      setTimeout(loadData, 1000);
    }
  };

  const filterByProvider = (
    solicitudes: Map<String, Array<Facture>>
  ): Map<String, Array<Facture>> => {
    const filtered: Map<String, Array<Facture>> = new Map();
    solicitudes.forEach((facture: Array<Facture>, project: string) => {
      const filteredFactures: Array<Facture> = facture.filter(
        (item) =>
          item.provider?.name.toLowerCase() === busqueda.toLowerCase() ||
          item.provider?.name.toLowerCase().includes(busqueda.toLowerCase()) ||
          item.providerIg?.name.toLowerCase() === busqueda.toLowerCase() ||
          item.providerIg?.name
            .toLowerCase()
            .includes(busqueda.toLowerCase()) ||
          item.providerCalderon?.name.toLowerCase() ===
            busqueda.toLowerCase() ||
          item.providerCalderon?.name
            .toLowerCase()
            .includes(busqueda.toLowerCase()) ||
          item.providerBalcon?.name.toLowerCase() === busqueda.toLowerCase() ||
          item.providerBalcon?.name
            .toLowerCase()
            .includes(busqueda.toLowerCase()) ||
          item.providerRecaudaciones?.name.toLowerCase() ===
            busqueda.toLowerCase() ||
          item.providerRecaudaciones?.name
            .toLowerCase()
            .includes(busqueda.toLowerCase())
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

  const getSolicitudesByProjects = (
    arraySolicitude: Array<Solicitude>,
    arrayByProject: Map<String, Facture[]>
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
                    {itemIgFac.project.name ?? " "}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 400,
                    }}
                  >
                    {itemIgFac.centerCost.name ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 400,
                    }}
                  >
                    {itemIgFac.provider.name ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 90,
                    }}
                  >
                    {itemIgFac.factureDate ?? ""}
                  </td>
                  <td
                    style={{
                      border: "1px solid ",
                      padding: "0.25em",
                      width: 50,
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
              {projectFacturesTotal(factures, project)}
            </tr>
          </tbody>
          <br />
        </>
      );
    });
    return jsxArray;
  };

  const getSolicitudesByAllProjects = (
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
                    IG
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

  const getSolicitudesByAllProjectsCalderon = (
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
                    CALDERON
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

  const getSolicitudesByAllProjectB = (
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
                    BALCON
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

  const getSolicitudesByAllProjectR = (
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
                    RECAUDACIONES
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
  const fecha = Router.query.dateString as String;

  return (
    <>
      <title>Reporte de Proveedores</title>

      <LoadingContainer visible={!loading}>
        <style>
          {`
            body {
              background-color: white !important;
            }
         `}
        </style>
        <h2 className="text-center my-4 mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
          REPORTE DE PROVEEDORES {fecha}
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
              <div id="const" className="mx-4">
                <table className="p-1" width={"100%"}>
                  <thead>
                    <tr
                      style={{
                        textAlign: "center",
                        background: "#8c4343",
                      }}
                    >
                      <th style={{ width: 40, border: "1px solid" }}>#</th>
                      <th style={{ width: 71, border: "1px solid" }}>Fecha</th>
                      <th style={{ width: 71, border: "1px solid" }}>
                        Solicitante
                      </th>
                      <th style={{ width: 140, border: "1px solid" }}>
                        Proyecto
                      </th>
                      <th style={{ width: 400, border: "1px solid" }}>
                        Centro de Costos
                      </th>
                      <th style={{ width: 400, border: "1px solid" }}>
                        Proveedor
                      </th>
                      <th style={{ width: 80, border: "1px solid" }}>
                        Fecha fac
                      </th>
                      <th style={{ width: 60, border: "1px solid" }}>
                        # Factura
                      </th>
                      <th
                        style={{
                          width: 420,
                          border: "1px solid",
                        }}
                      >
                        Detalle
                      </th>
                      <th style={{ width: 60, border: "1px solid" }}>Valor</th>
                      {CheckPermissions(auth, [0, 2, 9]) && (
                        <th style={{ width: 50, border: "1px solid" }}>
                          Retencion
                        </th>
                      )}
                      {CheckPermissions(auth, [0, 2, 9]) && (
                        <th style={{ width: 60, border: "1px solid" }}>
                          Pagado
                        </th>
                      )}
                    </tr>
                  </thead>
                  {!CheckPermissions(auth, [8]) && (
                    <>
                      {getSolicitudesByProjects(
                        solicitudes.get("const"),
                        busqueda.length > 0
                          ? filterByProvider(solicitudesByProject)
                          : solicitudesByProject
                      )}
                    </>
                  )}
                </table>
              </div>
            </>
          )}

          {(solicitudes.get("ig") ?? []).length !== 0 && (
            <>
              <div id="ig" className="mx-4">
                <table className="p-1" width={"100%"}>
                  {CheckPermissions(auth, [0, 8]) && (
                    <>
                      {getSolicitudesByAllProjects(
                        solicitudes.get("ig"),
                        busqueda.length > 0
                          ? filterByProvider(solicitudesByProjectIg)
                          : solicitudesByProjectIg
                      )}
                    </>
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
                  {!CheckPermissions(auth, [8]) && (
                    <>
                      {getSolicitudesByAllProjectsCalderon(
                        solicitudes.get("calderon"),
                        busqueda.length > 0
                          ? filterByProvider(solicitudesByProjectCalderon)
                          : solicitudesByProjectCalderon
                      )}
                    </>
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
                  {!CheckPermissions(auth, [8]) && (
                    <>
                      {getSolicitudesByAllProjectB(
                        solicitudes.get("balcon"),
                        busqueda.length > 0
                          ? filterByProvider(solicitudesByProjectB)
                          : solicitudesByProjectB
                      )}
                    </>
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
                  {!CheckPermissions(auth, [8]) && (
                    <>
                      {getSolicitudesByAllProjectR(
                        solicitudes.get("recaudaciones"),
                        busqueda.length > 0
                          ? filterByProvider(solicitudesByProjectR)
                          : solicitudesByProjectR
                      )}
                    </>
                  )}
                </table>
              </div>
            </>
          )}

          <h3 className="text-center text-xl my-4 mb-4 font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">
            ANTICIPOS
          </h3>
          {(solicitudes.get("adv-const") ?? []).length !== 0 && (
            <>
              <div id="adv-const" className="mx-4">
                <table className="p-1" width={"100%"}>
                  {!CheckPermissions(auth, [8]) && (
                    <>
                      {getSolicitudesByProjects(
                        solicitudes.get("adv-const"),
                        busqueda.length > 0
                          ? filterByProvider(advancesByProject)
                          : advancesByProject
                      )}
                    </>
                  )}
                </table>
              </div>
            </>
          )}
          {(solicitudes.get("adv-ig") ?? []).length !== 0 && (
            <>
              <div id="adv-ig" className="mx-4">
                <table className="p-1" width={"100%"}>
                  {CheckPermissions(auth, [0, 8, 2, 3, 9]) && (
                    <>
                      {getSolicitudesByAllProjects(
                        solicitudes.get("adv-ig"),
                        busqueda.length > 0
                          ? filterByProvider(advancesByProjectIg)
                          : advancesByProjectIg
                      )}
                    </>
                  )}
                </table>
              </div>
              <br />
            </>
          )}
          {(solicitudes.get("adv-calderon") ?? []).length !== 0 && (
            <>
              <div id="adv-calderon" className="mx-4">
                <table className="p-1" width={"100%"}>
                  {!CheckPermissions(auth, [8]) && (
                    <>
                      {getSolicitudesByAllProjectsCalderon(
                        solicitudes.get("adv-calderon"),
                        busqueda.length > 0
                          ? filterByProvider(advancesByProjectC)
                          : advancesByProjectC
                      )}
                    </>
                  )}
                </table>
              </div>
              <br />
            </>
          )}
          {(solicitudes.get("adv-balcon") ?? []).length !== 0 && (
            <>
              <div id="adv-balcon" className="mx-4">
                <table className="p-1" width={"100%"}>
                  {!CheckPermissions(auth, [8]) && (
                    <>
                      {getSolicitudesByAllProjectB(
                        solicitudes.get("adv-balcon"),
                        busqueda.length > 0
                          ? filterByProvider(advancesByProjectB)
                          : advancesByProjectB
                      )}
                    </>
                  )}
                </table>
              </div>
              <br />
            </>
          )}
          {(solicitudes.get("adv-recaudaciones") ?? []).length !== 0 && (
            <>
              <div id="adv-recaudaciones" className="mx-4">
                <table className="p-1" width={"100%"}>
                  {!CheckPermissions(auth, [8]) && (
                    <>
                      {getSolicitudesByAllProjectR(
                        solicitudes.get("adv-recaudaciones"),
                        busqueda.length > 0
                          ? filterByProvider(advancesByProjectR)
                          : advancesByProjectR
                      )}
                    </>
                  )}
                </table>
              </div>
              <br />
            </>
          )}
        </div>
      </LoadingContainer>
    </>
  );
};

export default GeneralReportProvider;
