import naturalscience from "../assets/icons/ns.svg";
import math from "../assets/icons/math.svg";
import phy from "../assets/icons/phy.svg";
import chem from "../assets/icons/chem.svg";
import life from "../assets/icons/plant.svg";

import it from "../assets/icons/it.svg";
import jj from "../assets/icons/jj.svg";
import bsg from "../assets/icons/bsg.svg";
import sj from "../assets/icons/sj.svg";
import by from "../assets/icons/by.svg";

import swy from "../assets/icons/swy.svg";
import cs from "../assets/icons/cs.svg";
import gy from "../assets/icons/gy.svg";
import jn from "../assets/icons/jn.svg";

import engineering from "../assets/icons/engineering.svg";
import me from "../assets/icons/me.svg";
import ce from "../assets/icons/ce.svg";
import amse from "../assets/icons/amse.svg";
import arch from "../assets/icons/arch.svg";
import sg from "../assets/icons/sg.svg";
import gc from "../assets/icons/gc.svg";
import nano from "../assets/icons/nano.svg";
import quantum from "../assets/icons/quantum.svg";

import yak from "../assets/icons/yak.svg";
import med from "../assets/icons/med.svg";

import lifee from "../assets/icons/life.svg";
import food from "../assets/icons/food.svg";
import bm from "../assets/icons/bm.svg";
import ys from "../assets/icons/ys.svg";

import soccer from "../assets/icons/soccer.svg";
import sports from "../assets/icons/baseball.svg";

import hospital from "../assets/icons/hospital.svg";
import dr from "../assets/icons/dr.svg";

import logo from "../assets/logo/logoxmas.svg";

/* Search filter tags */
export const GROUPS = [
  {
    groupId: "ns",
    label: "Natural Science",
    icon: naturalscience,
    sub: [
      { id: "Biological Sciences", groupId: "ns", label: "Biological Sciences", icon: life, color: "#66A945" },
      { id: "Math", groupId: "ns", label: "Math", icon: math, color: "#bfca25ff" },
      { id: "Physics", groupId: "ns", label: "Physics", icon: phy, color: "#5185C5" },
      { id: "Chemistry", groupId: "ns", label: "Chemistry", icon: chem, color: "#E56C3E" },
    ],
  },
  {
    groupId: "it",
    label: "Information & Communication",
    icon: it,
    sub: [
      { id: "Electrical & Electronics Engineering", groupId: "it", label: "Electrical & Electronics Engineering", icon: jj, color: "#FBB917" },
      { id: "Semiconductor Systems Engineering", groupId: "it", label: "Semiconductor Systems Engineering", icon: bsg, color: "#76C88D" },
      { id: "Materials Convergence Engineering", groupId: "it", label: "Materials Convergence Engineering", icon: sj, color: "#D38DD7" },
      { id: "Semiconductor Convergence Engineering", groupId: "it", label: "Semiconductor Convergence Engineering", icon: by, color: "#13501B" },
    ],
  },
  {
    groupId: "swy",
    label: "Software",
    icon: swy,
    sub: [
      { id: "Software Engineering", groupId: "swy", label: "Software Engineering", icon: cs, color: "#6DC8EB" },
      { id: "Global Convergence Division", groupId: "swy", label: "Global Convergence Division", icon: gy, color: "#C00000" },
      { id: "Intelligent Software Engineering", groupId: "swy", label: "Intelligent Software Engineering", icon: jn, color: "#104862" },
    ],
  },
  {
    groupId: "eng",
    label: "Engineering",
    icon: engineering,
    sub: [
      { id: "Chemical Engineering", groupId: "eng", label: "Chemical Engineering", icon: ce, color: "#DD6B7B" },
      { id: "Advanced Material Engineering", groupId: "eng", label: "Advanced Material Engineering", icon: amse, color: "#DAB4D4" },
      { id: "Mechanical Engineering", groupId: "eng", label: "Mechanical Engineering", icon: me, color: "#69A9C7" },
      { id: "Civil and Architectural Engineering", groupId: "eng", label: "Civil and Architectural Engineering", icon: arch, color: "#9C7743" },
      { id: "Systems Management Engineering", groupId: "eng", label: "Systems Management Engineering", icon: sg, color: "#A1AF81" },
      { id: "Architecture", groupId: "eng", label: "Architecture", icon: gc, color: "#BFB889" },
      { id: "Nano Engineering", groupId: "eng", label: "Nano Engineering", icon: nano, color: "#31DFB6"},
      { id: "Quantum Information Engineering", groupId: "eng", label: "Quantum Information Engineering", icon: quantum, color: "#818AFF"},
    ],
  },
  {
    groupId: "yak",
    label: "Pharmacy",
    icon: yak,
    sub: [
      { id: "Pharmacy", groupId: "yak", label: "Pharmacy", icon: med, color: "#735198" },
    ],
  },
  {
    groupId: "lifee",
    label: "Bioengineering",
    icon: lifee,
    sub: [
      { id: "Food Bioengineering", groupId: "lifee", label: "Food Bioengineering", icon: food, color: "#9FA244" },
      { id: "Bio Mechatronics", groupId: "lifee", label: "Bio Mechatronics", icon: bm, color: "#535CA8" },
      { id: "Integrative Biotechnology", groupId: "lifee", label: "Integrative Biotechnology", icon: ys, color: "#684870" },
    ],
  },
  {
    groupId: "soccer",
    label : "Sport Science",
    icon: soccer,
    sub: [
      { id: "Sports Science", groupId: "soccer", label: "Sports Science", icon: sports, color: "#E09C30" },
    ],
  },
  {
    groupId: "hp",
    label: "Medicine",
    icon: hospital,
    sub: [
      { id: "Medicine", groupId: "hp", label: "Medicine", icon: dr, color: "#A2C3E7" },
    ],
  },
];
