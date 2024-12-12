import os
import json
import markdown
import re

def get_content(directory):
    content = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.md') or file.endswith('.mdx'):
                try:
                    with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                        md_content = f.read()
                        
                        # Extract title from the frontmatter
                        title_match = re.search(r'^---\s*\ntitle:\s*(.+?)\s*\n', md_content, re.MULTILINE)
                        title = title_match.group(1) if title_match else file.replace('.md', '').replace('.mdx', '')
                        
                        # Remove frontmatter
                        md_content = re.sub(r'^---\s*\n.*?\n---\s*\n', '', md_content, flags=re.DOTALL)
                        
                        html_content = markdown.markdown(md_content)
                        
                        # Generate URL with '/docs/' prefix
                        url = '/docs/' + os.path.relpath(os.path.join(root, file), directory).replace('\\', '/')
                        url = url.replace('.md', '').replace('.mdx', '')
                        if url.endswith('/index'):
                            url = url[:-5]  # Remove 'index' from the end of the URL
                        
                        content.append({
                            'title': title,
                            'content': html_content,
                            'url': url
                        })
                except UnicodeDecodeError:
                    print(f"Warning: Unable to read file {file} with UTF-8 encoding. Skipping this file.")
    return content

def generate_json(content_dir, output_file):
    content = get_content(content_dir)
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)
    print(f"Generated {output_file} with {len(content)} articles.")

# Paths
docs_dir = 'docs'
static_dir = 'static'
output_file = os.path.join(static_dir, 'content.json')

# Generate JSON file
generate_json(docs_dir, output_file)

print("JSON generation complete.")