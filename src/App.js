import './App.css';
import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Button, Checkbox } from '@mui/material'
import nodes from './nodes.json'

function App() {


  useEffect(() => {
    const persistedNodes = localStorage.getItem("selected_nodes");
    setSelectedNodes(JSON.parse(persistedNodes) ?? []);
  }, [])


  const [selectedNodes, setSelectedNodes] = useState([]);
  const toggleNode = (node, isSelected) => {
    if (isSelected) {
      setSelectedNodes((prevNodes) => [...prevNodes].filter(e => e.id !== node.id));
    } else {
      setSelectedNodes((prevNodes) => [...prevNodes, node]);
    }
  }

  const renderTree = (nodes) => {
    if (!nodes?.length) {
      return null
    }
    return nodes.map(node => {
      const isNodeSelected = selectedNodes.find(e => e.id === node.id);
      return <div key={node.id} style={{ display: 'flex', flexDirection: 'row', border: '1px solid black', alignItems: 'center' }}>
        <Checkbox checked={!!isNodeSelected} onClick={toggleNode.bind(null, node, isNodeSelected)} />
        <TreeItem key={node.id} nodeId={node.id.toString()} label={node.name}>
          {Array.isArray(node.children) && node.children.length
            ? node.children?.map((nodeChild) => {
              const isNodeChildSelected = selectedNodes.find(e => e.id === nodeChild.id);
              return <div key={nodeChild.id} style={{ display: 'flex', flexDirection: 'row', border: '1px solid black', alignItems: 'center' }}>
                <Checkbox
                  checked={!!isNodeChildSelected}
                  onClick={toggleNode.bind(null, nodeChild, isNodeChildSelected)}
                />
                <TreeItem key={nodeChild.id} nodeId={nodeChild.id.toString()} label={nodeChild.name}>
                  {renderTree(nodeChild.children)}
                </TreeItem>
              </div>
            })
            : null
          }
        </TreeItem>
      </div>
    });
  };

  const saveNodes = () => {
    localStorage.setItem("selected_nodes", JSON.stringify(selectedNodes));
    alert('Successfully persisted');
  };

  return (
    <TreeView
      aria-label="rich object"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTree(nodes)}
      <Button onClick={saveNodes.bind()} variant="outlined">Save</Button>
    </TreeView>
  );
}

export default App;