import Router from "next/router";
import { useEffect, useState } from "react";
import LoadingContainer from "../../lib/components/loading_container";
import { useAuth } from "../../lib/hooks/use_auth";
import { Facture, Solicitude } from "../../lib/types";
import { CheckPermissions } from "../../lib/utils/check_permissions";
import HttpClient from "../../lib/utils/http_client";

const GeneralReportCenterCost = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [solicitudes, setSolicitudes] = useState<
    Map<string, Array<Solicitude>>
  >(new Map());
  const [values, setValues] = useState<Map<string, number>>(new Map());
  const [solicitudesbyCCic, setSolicitudesbyCCic] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [solicitudesbyCCig, setSolicitudesbyCCig] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [solicitudesbyCCcal, setSolicitudesbyCCcal] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [solicitudesbyCCbal, setSolicitudesbyCCbal] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [solicitudesByCCrec, setSolicitudesbyCCrec] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [advancesbyCCic, setAdvacesbyCCic] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [advancesbyCCig, setAdvancesbyCCig] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [advancesbyCCcal, setAdvancesbyCCcal] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [advancesbyCCbal, setAdvancesbyCCbal] = useState<
    Map<String, Array<Facture>>
  >(new Map());
  const [advancesbyCCrec, setAdvancesbyCCrec] = useState<
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
          valueNet += facture.valueNet;
          valueRetention += facture.valueRetention;
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
          advanceValueNet += facture.valueNet;
          advanceValueRetention += facture.valueRetention;
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
          advanceValueNet += facture.valueNet;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += facture.discount;
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
          advanceValueNet += facture.valueNet;
          advanceValueRetention += facture.valueRetention;
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
          advanceValueNet += facture.valueNet;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += advanceDiscount;
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
          advanceValueNet += facture.valueNet;
          advanceValueRetention += facture.valueRetention;
          advanceDiscount += advanceDiscount;
        });
      });

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
          ["adv-valueNet", advanceValueNet],
          ["adv-discount", advanceDiscount],
        ])
      );

      let auxSolicitudesByCCic: Map<String, Array<Facture>> = new Map();
      concatConst.forEach((solicitude: Solicitude) =>
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxSolicitudesByCCic.keys()).includes(
              facture.project.name
            )
          ) {
            auxSolicitudesByCCic.set(facture.project.name, [facture]);
          } else {
            auxSolicitudesByCCic.set(facture.project.name, [
              ...auxSolicitudesByCCic.get(facture.project.name),
              facture,
            ]);
          }
        })
      );
      setSolicitudesbyCCic(auxSolicitudesByCCic);

      let auxSolicitudesByCCig: Map<String, Array<Facture>> = new Map();
      concatIg.forEach((solicitude: Solicitude) =>
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxSolicitudesByCCig.keys()).includes(
              facture.project.name
            )
          ) {
            auxSolicitudesByCCig.set(facture.project.name, [facture]);
          } else {
            auxSolicitudesByCCig.set(facture.project.name, [
              ...auxSolicitudesByCCig.get(facture.project.name),
              facture,
            ]);
          }
        })
      );
      setSolicitudesbyCCig(auxSolicitudesByCCig);

      let auxSolicitudesByCCcal: Map<String, Array<Facture>> = new Map();
      concatCalderon.forEach((solicitude: Solicitude) =>
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxSolicitudesByCCcal.keys()).includes(
              facture.project.name
            )
          ) {
            auxSolicitudesByCCcal.set(facture.project.name, [facture]);
          } else {
            auxSolicitudesByCCcal.set(facture.project.name, [
              ...auxSolicitudesByCCcal.get(facture.project.name),
              facture,
            ]);
          }
        })
      );
      setSolicitudesbyCCcal(auxSolicitudesByCCcal);

      let auxSolicitudesByCCbal: Map<String, Array<Facture>> = new Map();
      concatBalcon.forEach((solicitude: Solicitude) =>
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxSolicitudesByCCbal.keys()).includes(
              facture.project.name
            )
          ) {
            auxSolicitudesByCCbal.set(facture.project.name, [facture]);
          } else {
            auxSolicitudesByCCbal.set(facture.project.name, [
              ...auxSolicitudesByCCbal.get(facture.project.name),
              facture,
            ]);
          }
        })
      );
      setSolicitudesbyCCbal(auxSolicitudesByCCbal);

      let auxSolicitudesByCCrec: Map<String, Array<Facture>> = new Map();
      concatRecaudaciones.forEach((solicitude: Solicitude) =>
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxSolicitudesByCCrec.keys()).includes(
              facture.project.name
            )
          ) {
            auxSolicitudesByCCrec.set(facture.project.name, [facture]);
          } else {
            auxSolicitudesByCCrec.set(facture.project.name, [
              ...auxSolicitudesByCCrec.get(facture.project.name),
              facture,
            ]);
          }
        })
      );
      setSolicitudesbyCCrec(auxSolicitudesByCCrec);

      let auxAdvancesByCCic: Map<String, Array<Facture>> = new Map();
      concatAdvConst.forEach((solicitude: Solicitude) =>
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxAdvancesByCCic.keys()).includes(facture.project.name)
          ) {
            auxAdvancesByCCic.set(facture.project.name, [facture]);
          } else {
            auxAdvancesByCCic.set(facture.project.name, [
              ...auxAdvancesByCCic.get(facture.project.name),
              facture,
            ]);
          }
        })
      );
      setAdvacesbyCCic(auxAdvancesByCCic);

      let auxAdvancesByCCig: Map<String, Array<Facture>> = new Map();
      concatAdvIg.forEach((solicitude: Solicitude) =>
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxAdvancesByCCig.keys()).includes(facture.project.name)
          ) {
            auxAdvancesByCCig.set(facture.project.name, [facture]);
          } else {
            auxAdvancesByCCig.set(facture.project.name, [
              ...auxAdvancesByCCig.get(facture.project.name),
              facture,
            ]);
          }
        })
      );
      setAdvancesbyCCig(auxAdvancesByCCig);

      let auxAdvancesByCCcal: Map<String, Array<Facture>> = new Map();
      concatAdvCalderon.forEach((solicitude: Solicitude) =>
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxAdvancesByCCcal.keys()).includes(
              facture.project.name
            )
          ) {
            auxAdvancesByCCcal.set(facture.project.name, [facture]);
          } else {
            auxAdvancesByCCcal.set(facture.project.name, [
              ...auxAdvancesByCCcal.get(facture.project.name),
              facture,
            ]);
          }
        })
      );
      setAdvancesbyCCcal(auxAdvancesByCCcal);

      let auxAdvancesByCCbal: Map<String, Array<Facture>> = new Map();
      concatAdvBalcon.forEach((solicitude: Solicitude) =>
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxAdvancesByCCbal.keys()).includes(
              facture.project?.name
            )
          ) {
            auxAdvancesByCCbal.set(facture.project?.name, [facture]);
          } else {
            auxAdvancesByCCbal.set(facture.project?.name, [
              ...auxAdvancesByCCbal.get(facture.project?.name),
              facture,
            ]);
          }
        })
      );
      setAdvancesbyCCbal(auxAdvancesByCCbal);

      let auxAdvancesByCCrec: Map<String, Array<Facture>> = new Map();
      concatAdvRecaudaciones.forEach((solicitude: Solicitude) =>
        solicitude.items.forEach((facture: Facture) => {
          if (
            !Array.from(auxAdvancesByCCrec.keys()).includes(
              facture.project.name
            )
          ) {
            auxAdvancesByCCrec.set(facture.project.name, [
              ...auxAdvancesByCCrec.get(facture.project.name),
              facture,
            ]);
          }
        })
      );
      setAdvancesbyCCrec(auxAdvancesByCCrec);
      setLoading(true);
    } else {
      setTimeout(loadData, 1000);
    }
  };

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

  const filterByCC = (
    solicitudes: Map<String, Array<Facture>>
  ): Map<String, Array<Facture>> => {
    const filtered: Map<String, Array<Facture>> = new Map();
    solicitudes.forEach((facture: Array<Facture>, project: string) => {
      const filteredFactures: Array<Facture> = facture.filter(
        (item) =>
          item.centerCost?.name.toLowerCase() === busqueda.toLowerCase() ||
          item.centerCost?.name
            .toLowerCase()
            .includes(busqueda.toLowerCase()) ||
          item.centerCostIg?.name.toLowerCase() === busqueda.toLowerCase() ||
          item.centerCostIg?.name
            .toLowerCase()
            .includes(busqueda.toLowerCase()) ||
          item.centerCostCalderon?.name.toLowerCase() ===
            busqueda.toLowerCase() ||
          item.centerCostCalderon?.name
            .toLowerCase()
            .includes(busqueda.toLowerCase()) ||
          item.centerCostBalcon?.name.toLowerCase() ===
            busqueda.toLowerCase() ||
          item.centerCostBalcon?.name
            .toLowerCase()
            .includes(busqueda.toLowerCase()) ||
          item.details?.toLowerCase() === busqueda.toLowerCase() ||
          item.details?.toLowerCase().includes(busqueda.toLowerCase()) ||
          item.observation?.toLowerCase() === busqueda.toLowerCase() ||
          item.observation?.toLowerCase().includes(busqueda.toLowerCase()) ||
          item.observationConta?.toLowerCase() === busqueda.toLowerCase() ||
          item.observationConta
            ?.toLowerCase()
            .includes(busqueda.toLowerCase()) ||
          item.observationTreasury?.toLowerCase() === busqueda.toLowerCase() ||
          item.observationTreasury
            ?.toLowerCase()
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
      valueNet += facture.valueNet;
      valueRetention += facture.valueRetention;
      discount += facture.discount;
    });
    return (
      <>
        <th
          colSpan={12}
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
          colSpan={11}
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

  const getSolicitudesByCCic = (
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
                      width: 320,
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
                      width: 100,
                    }}
                  >
                    {itemIgFac.observation}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 100,
                    }}
                  >
                    {itemIgFac.observationConta}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 100,
                    }}
                  >
                    {itemIgFac.observationTreasury}
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

  const getSolicitudesByCCig = (
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
                      width: 100,
                    }}
                  >
                    {itemIgFac.observation}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 100,
                    }}
                  >
                    {itemIgFac.observationConta}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 100,
                    }}
                  >
                    {itemIgFac.observationTreasury}
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

  const getSolicitudesByCCcal = (
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
                      width: 100,
                    }}
                  >
                    {itemIgFac.observation}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 100,
                    }}
                  >
                    {itemIgFac.observationConta}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 100,
                    }}
                  >
                    {itemIgFac.observationTreasury}
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

  const getSolicitudesByCCbal = (
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
                      width: 100,
                    }}
                  >
                    {itemIgFac.observation}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 100,
                    }}
                  >
                    {itemIgFac.observationConta}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 100,
                    }}
                  >
                    {itemIgFac.observationTreasury}
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

  const getSolicitudesByCCrec = (
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
                      width: 100,
                    }}
                  >
                    {itemIgFac.observation}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 100,
                    }}
                  >
                    {itemIgFac.observationConta}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "0.25em",
                      width: 100,
                    }}
                  >
                    {itemIgFac.observationTreasury}
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
      <title>Reporte de Centros de Costos</title>
      <style>
        {`
            body {
              background-color: white !important;
            }
            @media print {
              .clase-a-ocultar {
                display: none !important;
              }
              
            }
         `}
      </style>
      <LoadingContainer visible={!loading}>
        <h2 className="text-center my-3 font-bold text-2xl">
          REPORTE DE CENTRO DE COSTOS {fecha}
        </h2>
        <div className="flex items-center justify-center mb-4">
          <div className="relative flex items-center w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-search text-gray-400"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </span>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full rounded-lg border focus:ring focus:ring-blue-300 focus:border-blue-300"
              value={busqueda}
              placeholder="Buscar aquí..."
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
        <h3 className="text-center mb-3 font-bold text-xl">SOLICITUDES</h3>
        <div
          style={{ width: "100%", fontSize: "11px", marginBottom: "2em" }}
          className="mx-auto"
        >
          {(solicitudes.get("const") ?? []).length !== 0 && (
            <>
              <div id="const" className="mx-4">
                <table className="p-1" width={"100%"}>
                  <thead>
                    <tr style={{ textAlign: "center", background: "#8c4343" }}>
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
                      <th>Observacion Solicitante</th>
                      <th>Observacion Contabilidad</th>
                      <th>Observacion Tesoreria</th>
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
                      {getSolicitudesByCCic(
                        solicitudes.get("const"),
                        busqueda.length > 0
                          ? filterByCC(solicitudesbyCCic)
                          : solicitudesbyCCic
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
                  {CheckPermissions(auth, [0, 8, 2, 3, 9]) && (
                    <>
                      {getSolicitudesByCCig(
                        solicitudes.get("ig"),
                        busqueda.length > 0
                          ? filterByCC(solicitudesbyCCig)
                          : solicitudesbyCCig
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
                      {getSolicitudesByCCcal(
                        solicitudes.get("calderon"),
                        busqueda.length > 0
                          ? filterByCC(solicitudesbyCCcal)
                          : solicitudesbyCCcal
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
                      {getSolicitudesByCCbal(
                        solicitudes.get("balcon"),
                        busqueda.length > 0
                          ? filterByCC(solicitudesbyCCbal)
                          : solicitudesbyCCbal
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
                      {getSolicitudesByCCrec(
                        solicitudes.get("recaudaciones"),
                        busqueda.length > 0
                          ? filterByCC(solicitudesByCCrec)
                          : solicitudesByCCrec
                      )}
                    </>
                  )}
                </table>
              </div>
              <br />
            </>
          )}

          <h3 className="text-center my-3 font-bold text-xl">ANTICIPOS</h3>
          {(solicitudes.get("adv-const") ?? []).length !== 0 && (
            <>
              <div id="adv-const" className="mx-4">
                <table className="p-1" width={"100%"}>
                  {!CheckPermissions(auth, [8]) && (
                    <>
                      {getSolicitudesByCCic(
                        solicitudes.get("adv-const"),
                        busqueda.length > 0
                          ? filterByCC(advancesbyCCic)
                          : advancesbyCCic
                      )}
                    </>
                  )}
                </table>
              </div>
              <br />
            </>
          )}
          {(solicitudes.get("adv-ig") ?? []).length !== 0 && (
            <>
              <div id="adv-ig" className="mx-4">
                <table className="p-1" width={"100%"}>
                  {CheckPermissions(auth, [0, 8]) && (
                    <>
                      {getSolicitudesByCCig(
                        solicitudes.get("adv-ig"),
                        busqueda.length > 0
                          ? filterByCC(advancesbyCCig)
                          : advancesbyCCig
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
                      {getSolicitudesByCCcal(
                        solicitudes.get("adv-calderon"),
                        busqueda.length > 0
                          ? filterByCC(advancesbyCCcal)
                          : advancesbyCCcal
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
                      {getSolicitudesByCCbal(
                        solicitudes.get("adv-balcon"),
                        busqueda.length > 0
                          ? filterByCC(advancesbyCCbal)
                          : advancesbyCCbal
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
                      {getSolicitudesByCCrec(
                        solicitudes.get("adv-recaudaciones"),
                        busqueda.length > 0
                          ? filterByCC(advancesbyCCrec)
                          : advancesbyCCrec
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
export default GeneralReportCenterCost;
