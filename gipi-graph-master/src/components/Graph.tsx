import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { palette as needlePalette } from './tokens';
import {
  GraphVisualizer,
  BasicNode,
  BasicRelationship,
  GraphModel,
  GraphStyleModel,
  ArcThemeProvider,
  baseArcTheme,
} from '@neo4j-devtools/arc';
import Sidebar from './SideBar';
const NDLColors = {
  neutral: {
    '70': {
      opacity50: 'rgba(113, 119, 128, 0.5)',
      opacity60: 'rgba(113, 119, 128, 0.6)',
    },
  },
};

const darkTheme = {
  ...baseArcTheme,
drawerHeaderFontFamily: 'Arial, sans-serif',
  name: 'dark',

  // Text colors
  primaryText: '#f4f4f4',
  secondaryText: '#eee',
  headerText: '#f4f4f4',
  link: '#5CA6D9',
  linkHover: '#1e70bf',

  // Backgrounds
  primaryBackground: '#525865',
  secondaryBackground: '#292C33',
  editorBackground: '#121212',
  alteringTableRowBackground: '#30333a',
  frameBackground: '#292C33',

  // Buttons
  primaryButtonBackground: '#428BCA',
  secondaryButtonBackground: '#4D4A57',

  // Borders
  inFrameBorder: '1px solid rgba(255,255,255,0.12)',

  // Frame
  frameSidebarBackground: '#121212',
  frameButtonHoverBackground: NDLColors.neutral['70'].opacity60,
  frameButtonActiveBackground: NDLColors.neutral['70'].opacity50,

  // Info message
  infoBackground: needlePalette.light.neutral.bg.strongest,
  infoBorder: `1px solid ${needlePalette.light.neutral.text.weakest}`,
  infoIconColor: needlePalette.light.neutral.bg.weak,
};

const GraphComponent: React.FC = () => {
  const [originalNodes, setOriginalNodes] = useState<BasicNode[]>([]); // API'den gelen düğümler
  const [originalRelationships, setOriginalRelationships] = useState<BasicRelationship[]>([]); // API'den gelen ilişkiler
    const [tempNodes, setTempNodes] = useState<BasicNode[]>([]);
  const [tempRelationships, setTempRelationships] = useState<BasicRelationship[]>([]); 
  let [graph, setGraph] = useState<GraphModel | null>(null); // Görselleştirilecek grafik modeli
  const [nodeLabels, setNodeLabels] = useState<string[]>([]); // Etiketler
  const [relationshipTypes, setRelationshipTypes] = useState<string[]>([]); // İlişki türleri
  const [propertyKeys, setPropertyKeys] = useState<string[]>([]); // Özellik anahtarları
  const [currentSelections, setCurrentSelections] = useState<{
    "Node Labels": string[];
    "Relationship Types": string[];
  }>({
    "Node Labels": [],
    "Relationship Types": [],
  });

  const [key, setKey] = useState(0); // A key to force re-renders

  const refreshGraph = () => {
    setKey((prevKey) => prevKey + 1); // Increment key to force re-render
  };

  const updateGraphData = () => {
    const newGraph = new GraphModel(); // Update your graph model here
    // Populate newGraph with new data...
    setGraph(newGraph);
    refreshGraph(); // Trigger re-render
  };

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const apiUrl = params.get("api_url");
  const token = params.get("token");


  // API'den veri çekme
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        if (!apiUrl || !token) {
          console.error("API URL veya token eksik.");
          return;
        }

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { nodes: apiNodes, relationships: apiRelationships } = response.data.data;

        const mappedNodes: BasicNode[] = apiNodes.map((node: any) => ({
          id: node.id,
          labels: node.labels || [],
          properties: node.properties || {},
          propertyTypes: node.propertyTypes || {},
        }));

        const mappedRelationships: BasicRelationship[] = apiRelationships.map((rel: any) => ({
          id: rel.id,
          startNodeId: rel.startNodeId,
          endNodeId: rel.endNodeId,
          type: rel.type,
          properties: rel.properties || {},
          propertyTypes: rel.propertyTypes || {},
        }));

        setOriginalNodes(mappedNodes); // API'den gelen düğümleri kaydet
        setOriginalRelationships(mappedRelationships); // API'den gelen ilişkileri kaydet
        setTempNodes(mappedNodes);
        setTempRelationships(mappedRelationships);

        setNodeLabels([...new Set(apiNodes.flatMap((node: any) => node.labels))] as string[]);
        setRelationshipTypes([...new Set(apiRelationships.map((rel: any) => rel.type))] as string[]);
        setPropertyKeys([
          ...new Set(apiNodes.flatMap((node: any) => Object.keys(node.properties || {}))),
        ] as string[]);

        // Başlangıç grafiğini oluştur
        const initialGraph = new GraphModel();
        initialGraph.addNodes(mappedNodes as any);
        initialGraph.addRelationships(mappedRelationships as any);
        setGraph(initialGraph);
      } catch (error) {
        console.error("Veri alınırken bir hata oluştu:", error);
      }
    };

    fetchGraphData();
  }, [apiUrl, token]);

useEffect(() => {
  console.log("currentSelections", currentSelections);

  const isEmptySelection =
    currentSelections["Node Labels"].length === 0 &&
    currentSelections["Relationship Types"].length === 0

  if (isEmptySelection) {
    console.log("isEmptySelection");
    setTempNodes(originalNodes);
    setTempRelationships(originalRelationships);
    if (key !== 0) {
      updateGraphData();
    }
    return;
  }

  let filteredNodes = originalNodes.filter((node) =>
    currentSelections["Node Labels"].some((label) => node.labels.includes(label))
  );

  const filteredRelationships = originalRelationships.filter((relationship) => {
    const isRelationshipTypeMatch = currentSelections["Relationship Types"].includes(relationship.type);
    const isStartNodeIncluded = originalNodes.some((node) => node.id === relationship.startNodeId);
    const isEndNodeIncluded = originalNodes.some((node) => node.id === relationship.endNodeId);

    // Include the relationship only if it matches the type and both nodes are included
    return isRelationshipTypeMatch && isStartNodeIncluded && isEndNodeIncluded;
  });

  const relatedNodeIds = new Set(
    filteredRelationships.flatMap((relationship) => [relationship.startNodeId, relationship.endNodeId])
  );

  const finalFilteredNodes = originalNodes.filter((node) => 
    filteredNodes.some((filteredNode) => filteredNode.id === node.id) || 
    relatedNodeIds.has(node.id)
  );


  setTempNodes(finalFilteredNodes);
  setTempRelationships(filteredRelationships);

  updateGraphData();
}, [currentSelections, originalNodes, originalRelationships]);


const handleEmitAllSelections = (selections:any) => {
  if (JSON.stringify(selections) !== JSON.stringify(currentSelections)) {
    setCurrentSelections(selections);
  }
};

  return (
    <ArcThemeProvider theme={darkTheme}>
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar
          
          nodeLabels={nodeLabels}
          relationshipTypes={relationshipTypes}
          propertyKeys={propertyKeys}
          emitAllSelections={handleEmitAllSelections} 
        />
        <div className="graph-container">
          {graph && (
              <GraphVisualizer
                key={key}
                nodes={tempNodes} 
                relationships={tempRelationships} 
                isFullscreen={true}
                wheelZoomInfoMessageEnabled={true}
                initialZoomToFit={true}
                autocompleteRelationships={false}
                graphStyleData={new GraphStyleModel()}
              />
          )}
        </div>
      </div>
          
    </ArcThemeProvider>
    
  );
};

export default GraphComponent;
