/* Arreglos de texto del test EHU.
   Corrige palabras juntas o separadas al cargar las preguntas.
   No toca las respuestas correctas ni el orden de las opciones. */
(function () {
  if (typeof EHU_QUESTIONS === 'undefined') return;

  var L = 'A-Za-zÁÉÍÓÚÜÑáéíóúüñ';

  // regla(buscar, poner, exacto, antes)
  // exacto = true distingue mayúsculas y minúsculas al buscar.
  // antes = texto que debe venir justo detrás (opcional).
  function regla(buscar, poner, exacto, antes) {
    var esc = buscar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var fin = antes ? '(?=' + antes + ')' : '(?![' + L + '])';
    return {
      re: new RegExp('(^|[^' + L + '])(' + esc + ')' + fin, exacto ? 'g' : 'gi'),
      poner: poner
    };
  }

  var GLOBALES = [
    regla('Lastres', 'las tres'),
    regla('de ben', 'deben'),
    regla('se an', 'sean'),
    regla('de no mina', 'denomina'),
    regla('de morada', 'demorada'),
    regla('con templa', 'contempla'),
    regla('con temple', 'contemple'),
    regla('con templado', 'contemplado'),
    regla('con curra', 'concurra'),
    regla('con trastada', 'contrastada'),
    regla('con tratado laboral', 'contratado laboral'),
    regla('con traídos', 'contraídos'),
    regla('con cierne', 'concierne'),
    regla('de talla', 'detalla', false, ' plazo'),
    regla('no lo de talla', 'no lo detalla'),
    regla('Al os', 'a los'),
    regla('Del os', 'de los'),
    regla('Del as', 'de las'),
    regla('Sila', 'si la'),
    regla('Sise', 'si se'),
    regla('Siun', 'si un'),
    regla('Siexiste', 'si existe'),
    regla('Losactos', 'los actos'),
    regla('Atoda', 'a toda'),
    regla('Atodo', 'a todo'),
    regla('Aser', 'a ser'),
    regla('Autilizar', 'a utilizar'),
    regla('Aacceder', 'a acceder'),
    regla('AlCampus', 'al Campus'),
    regla('Alas', 'a las', true),
    regla('ALA CONDICIÓN', 'a la condición', true),
    regla('Ala', 'a la', true, ' [' + L + ']'),
    regla('Derecho ala', 'Derecho a la'),
    regla('Eleuskera', 'el euskera'),
    regla('LO SU', 'LOSU', true),
    regla('De cana', 'Decana'),
    regla('El ola', 'el o la'),
    regla('Elo la', 'el o la'),
    regla('Rectora oo El', 'Rectora o El'),
    regla('oO varias', 'o varias'),
    regla('Las ala', 'la sala'),
    regla('Comoregla', 'como regla'),
    regla('PorCampus', 'por Campus'),
    regla('Elescáner', 'el escáner'),
    regla('Debesaber', 'debe saber'),
    regla('Quesirven', 'que sirven'),
    regla('Seconcederán', 'se concederán'),
    regla('Seinterrumpirán', 'se interrumpirán'),
    regla('Setratará', 'se tratará'),
    regla('Lereciba', 'le reciba'),
    regla('Tresaños', 'tres años'),
    regla('Dosañosni', 'dos años ni'),
    regla('Una ño', 'un año'),
    regla('niser', 'ni ser'),
    regla('noes', 'no es'),
    regla('Síen', 'sí en'),
    regla('ENINTERNET', 'en internet'),
    regla('asícomo', 'así como'),
    regla('Laa)', 'la a)'),
    regla('se ría', 'sería'),
    regla('ser su perada', 'ser superada'),
    regla('PRESUPUES TO', 'presupuesto'),
    regla('QUÉTIPO', 'QUÉ TIPO', true)
  ];

  // Reglas que solo valen para una pregunta concreta.
  var POR_PREGUNTA = {
    28: [['anteriores con correctas', 'anteriores son correctas']],
    81: [['Sino es posible', 'Si no es posible']],
    322: [['Solo sino son', 'Solo si no son']],
    447: [['pueden facilitan', 'pueden facilitar']]
  };

  function igualarMayusculas(original, nuevo) {
    var letras = original.replace(new RegExp('[^' + L + ']', 'g'), '');
    if (letras.length > 1 && letras === letras.toUpperCase()) {
      return nuevo.toUpperCase();
    }
    var primera = original.charAt(0);
    if (primera !== primera.toLowerCase()) {
      return nuevo.charAt(0).toUpperCase() + nuevo.slice(1);
    }
    return nuevo;
  }

  function arreglar(texto, num) {
    var t = String(texto);
    GLOBALES.forEach(function (r) {
      t = t.replace(r.re, function (m, antes, cuerpo) {
        return antes + igualarMayusculas(cuerpo, r.poner);
      });
    });
    // Números pegados a la palabra: 3meses, 1año
    t = t.replace(new RegExp('(\\d)(meses?|años?)(?![' + L + '])', 'g'), '$1 $2');
    var propias = POR_PREGUNTA[num];
    if (propias) {
      propias.forEach(function (p) {
        t = t.split(p[0]).join(p[1]);
      });
    }
    return t;
  }

  EHU_QUESTIONS.forEach(function (q) {
    q[1] = arreglar(q[1], q[0]);
    q[2] = q[2].map(function (o) { return arreglar(o, q[0]); });
  });
})();
