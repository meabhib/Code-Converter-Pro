
export const markdownToHtml = async (markdownString: string): Promise<string> => {
  try {
    let html = markdownString;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Code blocks
    html = html.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />');
    
    // Lists
    html = html.replace(/^\* (.+$)/gim, '<li>$1</li>');
    html = html.replace(/^- (.+$)/gim, '<li>$1</li>');
    html = html.replace(/^(\d+)\. (.+$)/gim, '<li>$2</li>');
    
    // Wrap consecutive list items
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, '');
    
    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    
    // Wrap in paragraphs
    if (!html.startsWith('<')) {
      html = '<p>' + html + '</p>';
    }
    
    return html;
  } catch (error) {
    throw new Error(`Markdown to HTML conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
