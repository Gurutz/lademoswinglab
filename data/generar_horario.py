#!/usr/bin/env python3
"""
generar_horario.py
Lee horario.json y reescribe, dentro de index.html, las dos versiones del horario
(tabla de escritorio y bloques responsive) entre estas marcas:

    <!-- HORARIO-DESKTOP:INICIO --> ... <!-- HORARIO-DESKTOP:FIN -->
    <!-- HORARIO-MOVIL:INICIO -->   ... <!-- HORARIO-MOVIL:FIN -->

Estructura esperada:
    index.html
    data/horario.json
    data/generar_horario.py

Uso (desde la carpeta que contiene index.html):
    python data/generar_horario.py

Antes de escribir crea una copia de seguridad: index.html.bak
"""
import json
import re
import shutil
import sys
from html import escape
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent      # carpeta data/
SITE_DIR = DATA_DIR.parent                       # carpeta con index.html
HTML_PATH = SITE_DIR / "index.html"
JSON_PATH = DATA_DIR / "horario.json"

DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]
BG_BLANCO = "bg-white"
BG_LILA = "bg-light-purple"


# ----------------------------------------------------------------- datos
def cargar_datos():
    with open(JSON_PATH, encoding="utf-8") as f:
        datos = json.load(f)

    hora_re = re.compile(r"^\d{1,2}:\d{2}$")
    for c in datos["clases"]:
        etiqueta = f'{c.get("dia")} {c.get("inicio")} {c.get("nombre")} {c.get("nivel")}'
        if c.get("dia") not in DIAS:
            sys.exit(f"ERROR: dia no valido en la clase: {etiqueta}  (validos: {', '.join(DIAS)})")
        for campo in ("inicio", "fin"):
            if not hora_re.match(str(c.get(campo, ""))):
                sys.exit(f'ERROR: "{campo}" debe tener formato HH:MM en la clase: {etiqueta}')
        for campo in ("nombre", "nivel", "profes"):
            if not c.get(campo):
                sys.exit(f'ERROR: falta "{campo}" en la clase: {etiqueta}')
    return datos


def color_de(clase, datos):
    """Color de fondo de las clases marcadas como nuevas."""
    if not clase.get("nuevo"):
        return None
    if clase.get("color"):
        return clase["color"]
    return datos.get("colores_curso_nuevo", {}).get(
        clase["nombre"], datos.get("color_curso_nuevo_por_defecto", "#F3FFD1")
    )


# ----------------------------------------------------------------- html
def tarjeta(clase, datos, ind, movil):
    """El <a> con el contenido de una clase. `ind` es la sangria base."""
    e = escape
    href = e(datos["enlace_inscripcion"], quote=True)
    if movil:
        badge = ('<span class="class-badge-mobile badge-bottom-right destacado-mobile">'
                 'curso nuevo</span>')
        div_cls = "class"
    else:
        badge = '<span class="class-badge clase-libre">curso nuevo</span>'
        div_cls = "class destacado" if clase.get("nuevo") else "class"

    lineas = [f'<div class="{div_cls}">']
    if clase.get("nuevo") and not movil:
        lineas.append(f"    {badge}")
    lineas += [
        f'    <p class="class-time">{e(clase["inicio"])}-{e(clase["fin"])}</p>',
        f'    <p class="class-name">{e(clase["nombre"])}</p>',
        f'    <p class="class-level">{e(clase["nivel"])}</p>',
        f'    <p class="class-teacher">{e(clase["profes"])}</p>',
    ]
    if clase.get("nuevo") and movil:
        lineas.append(f"    {badge}")
    lineas.append("</div>")
    return href, lineas


def generar_desktop(datos):
    clases = datos["clases"]
    horas = sorted({c["inicio"] for c in clases}, key=lambda h: int(h.split(":")[0]) * 60 + int(h.split(":")[1]))

    # filas necesarias por franja = maximo de clases simultaneas en un dia
    filas = []  # lista de (hora, [clase o None por dia], es_primera_de_franja)
    for hora in horas:
        por_dia = {d: [c for c in clases if c["dia"] == d and c["inicio"] == hora] for d in DIAS}
        n = max(len(v) for v in por_dia.values())
        for k in range(n):
            filas.append((hora, [por_dia[d][k] if k < len(por_dia[d]) else None for d in DIAS], k == 0))

    out = []
    for idx, (hora, celdas, primera) in enumerate(filas):
        ultima = idx == len(filas) - 1
        bg = BG_BLANCO if (primera and hora != horas[0]) else BG_LILA
        th_cls = "main-time bg-soft-purple" + (" bottom-left-rounded" if ultima else "")
        out.append("<tr>")
        out.append(f'    <th class="{th_cls}" scope="row"><p class="vertical">{escape(hora)}</p></th>')
        for i, clase in enumerate(celdas):
            td_cls = bg + (" bottom-rigth-rounded" if ultima and i == len(DIAS) - 1 else "")
            if clase is None:
                out.append(f'    <td class="{td_cls}"></td>')
                continue
            color = color_de(clase, datos)
            style = f' style="background-color: {color};"' if color else ""
            href, cuerpo = tarjeta(clase, datos, 0, movil=False)
            out.append(f'    <td class="{td_cls}"{style}>')
            out.append(f'        <a href="{href}" target="_blank">')
            out += ["            " + l for l in cuerpo]
            out.append("        </a>")
            out.append("    </td>")
        out.append("</tr>")
    return out


def generar_movil(datos):
    out = []
    for dia in DIAS:
        clases = sorted((c for c in datos["clases"] if c["dia"] == dia),
                        key=lambda c: tuple(int(x) for x in c["inicio"].split(":")))
        out.append('<div class="table-responsive rounded">')
        out.append(f'    <div class="day bg-white">{dia}</div>')
        for i, clase in enumerate(clases):
            bg = BG_BLANCO if i % 2 == 0 else BG_LILA
            color = color_de(clase, datos)
            style = f' style="background-color: {color};"' if color else ""
            href, cuerpo = tarjeta(clase, datos, 0, movil=True)
            out.append(f'    <a class="{bg}"{style} href="{href}" target="_blank">')
            out += ["        " + l for l in cuerpo]
            out.append("    </a>")
        out.append("</div>")
        out.append("")
    return out[:-1]


# ----------------------------------------------------------- sustitucion
def reemplazar(html, nombre, lineas, sangria):
    patron = re.compile(
        rf"([ \t]*)<!-- {nombre}:INICIO -->.*?<!-- {nombre}:FIN -->", re.DOTALL
    )
    if not patron.search(html):
        sys.exit(f"ERROR: no encuentro las marcas <!-- {nombre}:INICIO --> / <!-- {nombre}:FIN --> en index.html")
    pad = " " * sangria
    cuerpo = "\n".join((pad + l) if l else "" for l in lineas)
    nuevo = (f"{pad}<!-- {nombre}:INICIO -->\n"
             f"{pad}<!-- Generado por generar_horario.py desde horario.json. NO editar a mano. -->\n"
             f"{cuerpo}\n"
             f"{pad}<!-- {nombre}:FIN -->")
    return patron.sub(lambda m: nuevo, html, count=1)


def main():
    datos = cargar_datos()
    with open(HTML_PATH, encoding="utf-8") as f:
        html = f.read()

    html = reemplazar(html, "HORARIO-DESKTOP", generar_desktop(datos), 36)
    html = reemplazar(html, "HORARIO-MOVIL", generar_movil(datos), 28)

    shutil.copyfile(HTML_PATH, str(HTML_PATH) + ".bak")
    with open(HTML_PATH, "w", encoding="utf-8", newline="") as f:
        f.write(html)
    print(f"OK: {len(datos['clases'])} clases escritas en index.html (copia previa: index.html.bak)")


if __name__ == "__main__":
    main()
