# Entity-Relation Graph Visualizer

📊 A dynamic entity-relation graph interface using Neo4j Arc tools.

This project provides an interactive visualization of entity-relation data fetched from a REST API. Nodes and relationships are rendered using Neo4j’s official `@neo4j-devtools/arc` library. The user interface supports live filtering, dark theme, and real-time updates.



---

## 🚀 Features

- 🔁 **Real-time Data Fetching** via API
- 🧠 **Interactive Graph Filtering** by node labels and relationship types
- 🌙 **Dark Mode UI** with a custom ArcTheme
- 🔗 **@neo4j-devtools/arc** integrated graph visualization
- 📌 **Sidebar Controls** for fine-grained selection
- ♻️ **Re-rendering support** using state-managed key updates

---

## 🛠️ Built With

- [React](https://reactjs.org/)
- [Neo4j Arc](https://www.npmjs.com/package/@neo4j-devtools/arc)
- [Axios](https://axios-http.com/)
- [TypeScript or JavaScript](https://www.typescriptlang.org/) *(depending on your implementation)*

---

## 📡 Expected API Format

The application expects the following JSON structure from the API:

{
  "data": {
    "nodes": [
      {
        "id": "1",
        "labels": ["Person"],
        "properties": {
          "name": "Alice"
        },
        "propertyTypes": {
          "name": "String"
        }
      }
    ],
    "relationships": [
      {
        "id": "10",
        "startNodeId": "1",
        "endNodeId": "2",
        "type": "FRIENDS_WITH",
        "properties": {},
        "propertyTypes": {}
      }
    ]
  }
}

🧩 Customization

You can modify:

    🎨 darkTheme in GraphComponent.tsx to change UI colors

    ⚙️ Graph logic in GraphModel to support custom node/relationship behaviors

    📋 Sidebar selections to support additional filters like properties or value thresholds