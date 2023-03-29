
import drSimi from "@/assets/markers/dr-simi-marker.svg"
import cruzVerde from "@/assets/markers/cruz-verde-marker.svg"
import farmaciasAhumada from "@/assets/markers/ahumada-marker.svg"
import knop from "@/assets/markers/knop-marker.svg"
import salcobrand from "@/assets/markers/salcobrand-marker.svg"
import farmaciaDefault from "@/assets/markers/otras-cadenas-marker.svg"

import logo_dr_simi from "@/assets/logos/dr_simi.svg"
import logo_cruz_verde from "@/assets/logos/cruz_verde.svg"
import logo_farmacias_ahumada from "@/assets/logos/ahumada.svg"
import logo_knop from "@/assets/logos/knop.svg"
import logo_salcobrand from "@/assets/logos/salcobrand.svg"
import logo_farmacia_default from "@/assets/logos/default.svg"

import routeStart from "@/assets/markers/route-start.svg"


export let markers = {
  "dr_simi" : {
    icon: drSimi,
    logo: logo_dr_simi,
  },
  "cruz_verde" : {
    icon: cruzVerde,
    logo: logo_cruz_verde,
  },
  "farmacias_ahumada" : {
    icon: farmaciasAhumada,
    logo: logo_farmacias_ahumada,
  },
  "knop" : {
    icon: knop,
    logo: logo_knop,
  },
  "salcobrand" : {
    icon: salcobrand,
    logo: logo_salcobrand,
  },
  "farmacia_default" : {
    icon: farmaciaDefault,
    logo: logo_farmacia_default,
  },
}

export let routeIcons = {
  "start" : {
    icon: routeStart,
  },
}
