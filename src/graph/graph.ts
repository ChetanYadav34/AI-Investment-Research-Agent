// ============================================
// LangGraph Definition
// AI Investment Research Agent
// ============================================

import { StateGraph, START, END } from "@langchain/langgraph";
import { GraphState } from "./state";
import { coordinatorNode } from "./nodes/coordinator.node";
import { companyNode } from "./nodes/company.node";
import { financialNode } from "./nodes/financial.node";
import { newsNode } from "./nodes/news.node";
import { riskNode } from "./nodes/risk.node";
import { committeeNode } from "./nodes/committee.node";

// Define the graph structure
const builder = new StateGraph(GraphState)
  // Add all nodes
  .addNode("coordinator", coordinatorNode)
  .addNode("company", companyNode)
  .addNode("financial", financialNode)
  .addNode("news", newsNode)
  .addNode("risk", riskNode)
  .addNode("committee", committeeNode)

  // Define edges
  // 1. START -> Coordinator
  .addEdge(START, "coordinator")

  // 2. Coordinator -> Parallel Analysts
  .addEdge("coordinator", "company")
  .addEdge("coordinator", "financial")
  .addEdge("coordinator", "news")
  .addEdge("coordinator", "risk")

  // 3. Parallel Analysts -> Committee
  // We use multiple edges pointing to committee. The committee node will run
  // only after ALL incoming edges (company, financial, news, risk) have completed.
  .addEdge("company", "committee")
  .addEdge("financial", "committee")
  .addEdge("news", "committee")
  .addEdge("risk", "committee")

  // 4. Committee -> END
  .addEdge("committee", END);

// Compile the graph
export const researchGraph = builder.compile();
