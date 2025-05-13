import React, { useState } from 'react';
import './Sidebar.css';

interface SidebarProps {
  nodeLabels: string[];
  relationshipTypes: string[];
  propertyKeys: string[];
  emitAllSelections: (selections: {
    "Node Labels": string[];
    "Relationship Types": string[];
  }) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ nodeLabels, relationshipTypes, emitAllSelections }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Selection states
  const [selectedNodeLabels, setSelectedNodeLabels] = useState<Set<string>>(new Set());
  const [selectedRelationshipTypes, setSelectedRelationshipTypes] = useState<Set<string>>(new Set());

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleSelection = (
    item: string,
    set: Set<string>,
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    type: string
  ) => {
    const newSet = new Set(set);
    if (newSet.has(item)) {
      newSet.delete(item);
    } else {
      newSet.add(item);
    }
    setter(newSet);
    emitAllSelections({
      "Node Labels": [...(type === 'Node Labels' ? newSet : selectedNodeLabels)],
      "Relationship Types": [...(type === 'Relationship Types' ? newSet : selectedRelationshipTypes)],
    });
  };

  // const removeSelection = (
  //   item: string,
  //   set: Set<string>,
  //   setter: React.Dispatch<React.SetStateAction<Set<string>>>,
  //   type: string
  // ) => {
  //   const newSet = new Set(set);
  //   newSet.delete(item);
  //   setter(newSet);
  //   emitAllSelections({
  //     "Node Labels": [...(type === 'Node Labels' ? newSet : selectedNodeLabels)],
  //     "Relationship Types": [...(type === 'Relationship Types' ? newSet : selectedRelationshipTypes)],
  //   });
  // };

  return (
    <>
      {/* Toggle Button */}
      <button
        className="toggle-button"
        onClick={toggleSidebar}
        style={{
          left: isOpen ? '310px' : '10px', // Sidebar open at 310px, closed at 10px
        }}
      >
        {isOpen ? '<' : '>'}
      </button>

      <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        {isOpen && (
          <>
            {/* Display Selected Tags
            <div className="selected-tags">
              {[...selectedNodeLabels].map((label, index) => (
                <div className="selected-tag node-label" key={`node-${index}`}>
                  {label}
                  <span
                    className="remove-tag"
                    onClick={() => removeSelection(label, selectedNodeLabels, setSelectedNodeLabels, 'Node Labels')}
                  >
                    ×
                  </span>
                </div>
              ))}
              {[...selectedRelationshipTypes].map((type, index) => (
                <div className="selected-tag relationship-type" key={`rel-${index}`}>
                  {type}
                  <span
                    className="remove-tag"
                    onClick={() => removeSelection(type, selectedRelationshipTypes, setSelectedRelationshipTypes, 'Relationship Types')}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div> */}

            <div className="sidebar-content">
              {/* Node Labels */}
              <div className="sidebar-section">
                <h3>Node labels</h3>
                <div className="tags">
                  {nodeLabels.map((label, index) => (
                    <button
                      className={`tag node-label ${selectedNodeLabels.has(label) ? 'selected' : ''}`}
                      key={index}
                      onClick={() => toggleSelection(label, selectedNodeLabels, setSelectedNodeLabels, 'Node Labels')}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Relationship Types */}
              <div className="sidebar-section">
                <h3>Relationship types</h3>
                <div className="tags">
                  {relationshipTypes.map((type, index) => (
                    <button
                      className={`tag relationship-type ${selectedRelationshipTypes.has(type) ? 'selected' : ''}`}
                      key={index}
                      onClick={() => toggleSelection(type, selectedRelationshipTypes, setSelectedRelationshipTypes, 'Relationship Types')}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Sidebar;
