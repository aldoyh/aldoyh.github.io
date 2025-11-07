"""Run this model in Python

> pip install azure-ai-inference
"""
import os
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import AssistantMessage, SystemMessage, UserMessage, ToolMessage
from azure.ai.inference.models import ImageContentItem, ImageUrl, TextContentItem
from azure.core.credentials import AzureKeyCredential

# To authenticate with the model you will need to generate a personal access token (PAT) in your GitHub settings.
# Create your PAT token by following instructions here: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
client = ChatCompletionsClient(
    endpoint = "https://models.github.ai/inference",
    credential = AzureKeyCredential(os.environ["GITHUB_TOKEN"]),
)

messages = [
    UserMessage(content = [
        TextContentItem(text = "\n\nDownload all content from a YouTube channel, process into multiple formats, transcribe audio, and queue metadata generation via Ollama.\n\n# Steps\n1. **Download Source Content**:\n   - Fetch all videos, playlists, and Shorts from the specified YouTube channel.\n   - Save as MP4 files in the highest available quality.\n   - Use `yt-dlp` for downloading. Playlists ID for folder names if available, AND video ID for filenames.\n   - Use `ffmpeg` for any necessary format conversions.\n   - Use `whisper-cli` for audio transcription.\n\n2. **Format Conversion**:\n   - Create two additional copies of each MP4 file:\n     - **MP3**: Audio-only version.\n     - **16-bit WAV**: Uncompressed audio for transcription.\n\n3. **Transcription**:\n   - Process each WAV file using `whisper-cli` to generate a text transcript.\n   - Save transcripts as `.txt` files with matching filenames.\n\n4. **Metadata Queue**:\n   - Add all transcript files to a processing queue.\n   - Use Ollama to analyze transcripts and suggest improved titles/descriptions.\n\n5. Uploads a mirror storage to Cloudflare R2 Bucket.\n\n---\n\n# Output Format\nReturn a structured JSON object for each processed video, containing:\n```json\n{\n  \"source_video\": \"[YouTube URL]\",\n  \"downloaded_files\": {\n    \"mp4\": \"[filename].mp4\",\n    \"mp3\": \"[filename].mp3\",\n    \"wav\": \"[filename].wav\"\n  },\n  \"transcription\": {\n    \"status\": \"success/error\",\n    \"transcript_file\": \"[filename].txt\",\n    \"error_details\": \"[if applicable]\"\n  },\n  \"ollama_metadata_queue\": {\n    \"status\": \"queued/processed\",\n    \"suggested_title\": \"[Ollama-generated title]\",\n    \"suggested_description\": \"[Ollama-generated description]\"\n  }\n}\n```\n\n# Example\n**Input Channel**: `https://youtube.com/@example-channel`\n\n**Output**:\n```json\n{\n  \"source_video\": \"https://youtube.com/watch?v=abc123\",\n  \"downloaded_files\": {\n    \"mp4\": \"lecture_10.mp4\",\n    \"mp3\": \"lecture_10.mp3\",\n    \"wav\": \"lecture_10.wav\"\n  },\n  \"transcription\": {\n    \"status\": \"success\",\n    \"transcript_file\": \"lecture_10.txt\",\n    \"error_details\": null\n  },\n  \"ollama_metadata_queue\": {\n    \"status\": \"queued\",\n    \"suggested_title\": null,\n    \"suggested_description\": null\n  }\n}\n```\n\n# Notes\n- **Dependencies**: Ensure `yt-dlp`, `ffmpeg`, `whisper-cli`, and Ollama are installed and configured.\n- **Naming Convention**: Use consistent filenames across formats (e.g., `[video_id].mp4`, `[video_id].txt`).\n- **Placeholders**: Replace `[YouTube URL]`, `[filename]`, and Ollama-generated fields with actual values during execution."),
    ]),
]

tools = []

while True:
    response = client.complete(
        messages = messages,
        model = "deepseek/DeepSeek-R1",
        tools = tools,
    )

    if response.choices[0].message.tool_calls:
        print(response.choices[0].message.tool_calls)
        messages.append(response.choices[0].message)
        for tool_call in response.choices[0].message.tool_calls:
            messages.append(ToolMessage(
                content=locals()[tool_call.function.name](),
                tool_call_id=tool_call.id,
            ))
    else:
        print(f"[Model Response] {response.choices[0].message.content}")
        break
