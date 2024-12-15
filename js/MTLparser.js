"use strict";

// This is not a full .obj parser.
// see http://paulbourke.net/dataformats/obj/
async function parseMTL(text) {
  const materials = {};
  let material;

  const keywords = {
    newmtl(parts) {
      material = {};
      materials[parts[0]] = material;
    },
    Ka(parts) {
      material.ambient = parts.map(parseFloat);
    },
    Kd(parts) {
      material.diffuse = parts.map(parseFloat);
    },
    Ks(parts) {
      material.specular = parts.map(parseFloat);
    },
    Ns(parts) {
      material.shininess = parseFloat(parts[0]);
    },
    map_Kd(parts) {
      material.diffuseMap = parts.join(" ");
    },
  };

  const keywordRE = /(\w+)(?: )*(.*)/;
  const lines = text.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#")) {
      continue;
    }
    const m = keywordRE.exec(trimmed);
    if (!m) continue;

    const [, keyword, unparsedArgs] = m;
    const handler = keywords[keyword];
    if (!handler) continue;

    handler(unparsedArgs.split(/\s+/), unparsedArgs);
  }

  return materials;
}
