import PocketBase from "pocketbase";
import { countries } from "./data/countries";
import { cities } from "./data/cities";
import { zones } from "./data/zones";

const pb = new PocketBase(process.env.POCKETBASE_URL || "http://127.0.0.1:8090");

async function createCollectionIfNotExists(name: string, fields: any[]) {
  try {
    const existing = await pb.collections.getOne(name);
    if (!existing.listRule && existing.listRule !== "") {
      await pb.collections.update(name, {
        listRule: "",
        viewRule: "",
        createRule: "",
      });
      console.log(`Collection '${name}' already exists, updated API rules`);
    } else {
      console.log(`Collection '${name}' already exists, skipping creation`);
    }
  } catch {
    await pb.collections.create({
      name,
      type: "base",
      fields,
      listRule: "",
      viewRule: "",
      createRule: "",
    });
    console.log(`Created collection '${name}'`);
  }
}

async function seed() {
  await pb.admins.authWithPassword(
    process.env.PB_ADMIN_EMAIL || "admin@example.com",
    process.env.PB_ADMIN_PASSWORD || "adminpassword",
  );

  await createCollectionIfNotExists("countries", [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true },
    { name: "overview", type: "text", required: true },
    { name: "quick_facts", type: "json", required: true },
    { name: "map_center", type: "json", required: true },
    { name: "map_zoom", type: "number", required: true },
  ]);

  await createCollectionIfNotExists("cities", [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true },
    { name: "country_slug", type: "text", required: true },
    { name: "overview", type: "text", required: true },
    { name: "map_center", type: "json", required: true },
    { name: "map_zoom", type: "number", required: true },
  ]);

  await createCollectionIfNotExists("zones", [
    { name: "city_slug", type: "text", required: true },
    { name: "name", type: "text", required: true },
    { name: "type", type: "text", required: true },
    { name: "color", type: "text", required: true },
    { name: "center_lat", type: "number", required: true },
    { name: "center_lng", type: "number", required: true },
    { name: "radius_deg", type: "number", required: true },
    { name: "maps_link", type: "url", required: true },
    { name: "note", type: "text", required: true },
  ]);

  await createCollectionIfNotExists("briefs", [
    { name: "brief_id", type: "text", required: true },
    { name: "anchor_name", type: "text", required: true },
    { name: "anchor_lat", type: "number", required: true },
    { name: "anchor_lng", type: "number", required: true },
    { name: "city_slug", type: "text" },
    { name: "country_slug", type: "text" },
    { name: "zones", type: "json", required: true },
    { name: "brief_markdown", type: "text", required: true },
    { name: "generated_by", type: "text", required: true },
  ]);

  console.log("Seeding countries...");
  for (const country of countries) {
    try {
      const existing = await pb.collection("countries").getFirstListItem(`slug="${country.slug}"`);
      console.log(`  ${country.name} already exists, skipping`);
    } catch {
      await pb.collection("countries").create(country);
      console.log(`  Seeded ${country.name}`);
    }
  }

  console.log("Seeding cities...");
  for (const city of cities) {
    try {
      await pb.collection("cities").getFirstListItem(`slug="${city.slug}"`);
      console.log(`  ${city.name} already exists, skipping`);
    } catch {
      await pb.collection("cities").create(city);
      console.log(`  Seeded ${city.name}`);
    }
  }

  console.log("Seeding zones...");
  for (const zone of zones) {
    try {
      await pb.collection("zones").getFirstListItem(`name="${zone.name}" && city_slug="${zone.city_slug}"`);
      console.log(`  ${zone.name} (${zone.city_slug}) already exists, skipping`);
    } catch {
      await pb.collection("zones").create(zone);
      console.log(`  Seeded ${zone.name} (${zone.city_slug})`);
    }
  }

  console.log("Seed complete!");
}

seed().catch(console.error);
