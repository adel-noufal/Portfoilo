export const caseStudyContent: Record<string, { problem: string; architecture: string[] }> = {
  edusense: {
    problem: 'Classroom signals are easy to miss; turning them into relevant, teachable output takes more than a single model.',
    architecture: ['classroom signal', 'EfficientNet-B0', '7-agent orchestration', 'retrieved curriculum', 'lesson / report'],
  },
  stockpad: {
    problem: 'Stockrooms and requesters need a reliable material-request flow without spreadsheet handoffs.',
    architecture: ['request intake', 'Django REST services', 'PostgreSQL', 'HMAC-SHA256 sync', 'web / stockroom'],
  },
  'gmail-mcp': {
    problem: 'AI assistants need useful inbox actions without removing the user’s control over outgoing mail.',
    architecture: ['AI assistant', 'local MCP server', 'scoped Gmail tools', 'user approval', 'Gmail API'],
  },
  'asb-finstat': {
    problem: 'Company filings need to become structured information, even when statements require language detection and translation.',
    architecture: ['company lookup', 'statement retrieval', 'language / translation', 'table extraction', 'structured output'],
  },
  'progress-counter': {
    problem: 'A ten-day model-training progression should feel like an interactive story, not a static counter.',
    architecture: ['10-day timeline', 'JavaScript state', 'animated SVG', 'interactive story'],
  },
  'edusense-v1': {
    problem: 'Instructors need a live view of classroom expression signals, session events, and changes in engagement.',
    architecture: ['camera input', 'DeepFace analysis', 'FastAPI / Node', 'MySQL event log', 'live dashboard'],
  },
  safesight: {
    problem: 'Hard-hat and safety-vest checks need to flag violations across images and video without relying on manual review alone.',
    architecture: ['image / video', 'YOLOv8 detection', 'OpenCV processing', 'violation alerts'],
  },
  'young-creatives': {
    problem: 'Still being defined. This project is in progress and details are coming soon.',
    architecture: ['In progress'],
  },
};

export const liveDemoUrls: Record<string, string> = {};