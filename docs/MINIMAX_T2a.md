MiniMax Text-to-Speech (T2A) API Documentation
Introduction
The MiniMax T2A API supports synchronous text-to-speech audio generation with a maximum of 5000 characters of input. As a stateless interface, the model only processes directly passed input without storing any data.
Key Features

100+ existing voices to choose from
Adjustable volume, tone, speed, and output format for every voice
Weighted voice mixing: create unique voices from existing ones
Detailed manual control of pauses and speech rhythm
Multiple audio specifications and formats
Real-time streaming support

Use Cases

Phrase generation
Voice chat applications
Online social networking sites
Content narration

GitHub: MiniMax MCP
HTTP API
Endpoint: https://api.minimax.io/v1/t2a_v2
Available Models
All models support 24 languages including:

English (US, UK, Australia, India)
Chinese (Mandarin and Cantonese)
Japanese, Korean, French, German, Spanish, Portuguese (Brazilian), Italian
Arabic, Russian, Turkish, Dutch, Ukrainian, Vietnamese, Indonesian
Thai, Polish, Romanian, Greek, Czech, Finnish, Hindi

ModelDescriptionspeech-02-hdBrand new HD model with superior rhythm, stability, and sound qualityspeech-02-turboEnhanced multilingual capabilities with excellent performancespeech-01-hdRich voices, expressive emotions, authentic languagesspeech-01-turboExcellent performance and low latency
Request Parameters
Required Headers

Authorization: string (Required) - API key
Content-Type: application/json (Required)

URL Parameters

GroupId: (Required) - User group ID, appended to the API URL

Request Body
ParameterTypeRequiredDescriptionmodelstringYesModel selection: speech-02-hd, speech-02-turbo, speech-01-hd, speech-01-turbotextstringYesText to synthesize (max 5000 chars). Use <#x#> for pauses (x = 0.01-99.99 seconds)voice_settingobjectConditionalVoice configuration (see below)audio_settingobjectNoAudio output configurationpronunciation_dictobjectNoCustom pronunciation dictionarytimber_weightsobjectConditionalRequired if voice_id not providedstreambooleanNoEnable streaming output (default: false)language_booststringNoEnhance specific language recognitionsubtitle_enablebooleanNoEnable subtitle generation (default: false)output_formatstringNoOutput format: url or hex (default: hex)
voice_setting Object
json{
    "voice_id": "string",      // Voice identifier
    "speed": 1.0,              // Speech speed multiplier
    "vol": 1.0,                // Volume level
    "pitch": 0,                // Pitch adjustment
    "emotion": "happy"         // Emotional tone
}
audio_setting Object
json{
    "sample_rate": 32000,      // Sample rate in Hz
    "bitrate": 128000,         // Bitrate in bps
    "format": "mp3",           // Format: mp3/pcm/flac
    "channel": 1               // Audio channels (1=mono, 2=stereo)
}
Response Format
json{
    "data": {
        "audio": "hex_encoded_audio_data",
        "status": 2,
        "subtitle_file": "https://url-to-subtitle-file"
    },
    "extra_info": {
        "audio_length": 5746,
        "audio_sample_rate": 32000,
        "audio_size": 100845,
        "audio_bitrate": 128000,
        "word_count": 300,
        "invisible_character_ratio": 0,
        "audio_format": "mp3",
        "usage_characters": 630
    },
    "trace_id": "01b8bf9bb7433cc75c18eee6cfa8fe21",
    "base_resp": {
        "status_code": 0,
        "status_msg": ""
    }
}
Example cURL Request
bashcurl --location 'https://api.minimax.io/v1/t2a_v2?GroupId=${group_id}' \
--header 'Authorization: Bearer ${api_key}' \
--header 'Content-Type: application/json' \
--data '{
    "model": "speech-02-hd",
    "text": "The real danger is not that computers start thinking like people, but that people start thinking like computers.",
    "stream": false,
    "voice_setting": {
        "voice_id": "Grinch",
        "speed": 1,
        "vol": 1,
        "pitch": 0
    },
    "audio_setting": {
        "sample_rate": 32000,
        "bitrate": 128000,
        "format": "mp3",
        "channel": 1
    }
}'
Python Streaming Example
pythonimport json
import subprocess
import time
from typing import Iterator
import requests

group_id = 'your_group_id'
api_key = 'your_api_key'

url = f"https://api.minimax.io/v1/t2a_v2?GroupId={group_id}"
headers = {
    "Content-Type": "application/json", 
    "Authorization": f"Bearer {api_key}"
}

def call_tts_stream(text: str) -> Iterator[bytes]:
    body = {
        "model": "speech-02-turbo",
        "text": text,
        "stream": True,
        "voice_setting": {
            "voice_id": "male-qn-qingse",
            "speed": 1.0,
            "vol": 1.0,
            "pitch": 0
        },
        "audio_setting": {
            "sample_rate": 32000,
            "bitrate": 128000,
            "format": "mp3",
            "channel": 1
        }
    }
    
    response = requests.post(url, stream=True, headers=headers, json=body)
    
    for chunk in response.iter_content():
        if chunk and chunk.startswith(b'data:'):
            data = json.loads(chunk[5:])
            if "data" in data and "audio" in data["data"]:
                yield data["data"]["audio"]

# Process and save audio
audio_chunks = call_tts_stream("Hello, this is a test")
audio_bytes = b"".join(bytes.fromhex(chunk) for chunk in audio_chunks)

with open("output.mp3", "wb") as f:
    f.write(audio_bytes)
WebSocket API
Endpoint: wss://api.minimax.io/ws/v1/t2a_v2
Connection Flow

Establish Connection → Receive connected_success
Send task_start → Receive task_started
Send task_continue → Receive task_continued (with audio chunks)
Send task_finish → Receive task_finished

Event Types
1. Connection Establishment
Request Headers:
json{
    "Authorization": "Bearer your_api_key"
}
Response:
json{
    "session_id": "xxxx",
    "event": "connected_success",
    "trace_id": "0303a2882bf18235ae7a809ae0f3cca7",
    "base_resp": {
        "status_code": 0,
        "status_msg": "success"
    }
}
2. Task Start Event
Request:
json{
    "event": "task_start",
    "model": "speech-02-turbo",
    "language_boost": "English",
    "voice_setting": {
        "voice_id": "Wise_Woman",
        "speed": 1,
        "vol": 1,
        "pitch": 0,
        "emotion": "happy"
    },
    "audio_setting": {
        "sample_rate": 32000,
        "bitrate": 128000,
        "format": "mp3",
        "channel": 1
    }
}
Response:
json{
    "session_id": "xxxx",
    "event": "task_started",
    "trace_id": "0303a2882bf18235ae7a809ae0f3cca7",
    "base_resp": {
        "status_code": 0,
        "status_msg": "success"
    }
}
3. Task Continue Event
Request:
json{
    "event": "task_continue",
    "text": "Hello, this is the text message for test"
}
Response:
json{
    "data": {
        "audio": "hex_encoded_audio_chunk"
    },
    "extra_info": {
        "audio_length": 935,
        "audio_sample_rate": 32000,
        "audio_size": 15597,
        "bitrate": 128000,
        "word_count": 1,
        "invisible_character_ratio": 0,
        "usage_characters": 4,
        "audio_format": "mp3",
        "audio_channel": 1
    },
    "session_id": "xxxx",
    "event": "task_continued",
    "is_final": false,
    "trace_id": "0303a2882bf18235ae7a809ae0f3cca7",
    "base_resp": {
        "status_code": 0,
        "status_msg": "success"
    }
}
4. Task Finish Event
Request:
json{
    "event": "task_finish"
}
Response:
json{
    "session_id": "xxxx",
    "event": "task_finished",
    "trace_id": "0303a2882bf18235ae7a809ae0f3cca7",
    "base_resp": {
        "status_code": 0,
        "status_msg": "success"
    }
}
WebSocket Python Example
pythonimport asyncio
import websockets
import json
import ssl
from io import BytesIO

async def establish_connection(api_key):
    """Establish WebSocket connection"""
    url = "wss://api.minimax.io/ws/v1/t2a_v2"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    try:
        ws = await websockets.connect(url, additional_headers=headers, ssl=ssl_context)
        connected = json.loads(await ws.recv())
        if connected.get("event") == "connected_success":
            print("Connection successful")
            return ws
        return None
    except Exception as e:
        print(f"Connection failed: {e}")
        return None

async def start_task(websocket):
    """Send task start request"""
    start_msg = {
        "event": "task_start",
        "model": "speech-02-hd",
        "voice_setting": {
            "voice_id": "Wise_Woman",
            "speed": 1,
            "vol": 1,
            "pitch": 0,
            "emotion": "happy"
        },
        "audio_setting": {
            "sample_rate": 32000,
            "bitrate": 128000,
            "format": "mp3",
            "channel": 1
        }
    }
    await websocket.send(json.dumps(start_msg))
    response = json.loads(await websocket.recv())
    return response.get("event") == "task_started"

async def continue_task(websocket, text):
    """Send continue request and collect audio data"""
    await websocket.send(json.dumps({
        "event": "task_continue",
        "text": text
    }))
    
    audio_chunks = []
    while True:
        response = json.loads(await websocket.recv())
        if "data" in response and "audio" in response["data"]:
            audio_chunks.append(response["data"]["audio"])
        if response.get("is_final"):
            break
    return "".join(audio_chunks)

async def close_connection(websocket):
    """Close connection"""
    if websocket:
        await websocket.send(json.dumps({"event": "task_finish"}))
        await websocket.close()
        print("Connection closed")

async def main():
    API_KEY = "your_api_key_here"
    TEXT = "Hello, this is a text message for test"
    
    ws = await establish_connection(API_KEY)
    if not ws:
        return
    
    try:
        if not await start_task(ws):
            print("Failed to start task")
            return
        
        hex_audio = await continue_task(ws, TEXT)
        
        # Decode hex audio data
        audio_bytes = bytes.fromhex(hex_audio)
        
        # Save as MP3 file
        with open("output.mp3", "wb") as f:
            f.write(audio_bytes)
        print("Audio saved as output.mp3")
        
    finally:
        await close_connection(ws)

if __name__ == "__main__":
    asyncio.run(main())
Important Notes

Connection Timeout: WebSocket connections automatically terminate after 120 seconds of inactivity
Character Limit: Maximum 5000 characters per synthesis request
Pause Control: Use <#x#> syntax where x is seconds (0.01-99.99)
Audio Formats: Supports MP3, PCM, and FLAC
Streaming: Only hex format is supported for streaming responses
Language Boost: Use to improve recognition for specific languages/dialects

Error Handling
When a task_failed event is received, close the WebSocket connection immediately:
json{
    "session_id": "xxxx",
    "event": "task_failed",
    "trace_id": "0303a2882bf18235ae7a809ae0f3cca7",
    "base_resp": {
        "status_code": 1004,
        "status_msg": "Error description"
    }
}