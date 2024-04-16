import React, { useEffect, useState } from 'react';
import { EditorState, convertFromHTML, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { draftToHtml } from 'draftjs-to-html';
import { useLoaderData } from 'react-router-dom';

export default function Note() {
    const { note } = useLoaderData();

    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    useEffect(() => {
        const blocksFromHTML = convertFromHTML(note.content);
        const contentState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
        )
        setEditorState(EditorState.createWithContent(contentState));
    }, [note.content]);

    const [rawHTML, setRawHTML] = useState(note.content);

    useEffect(() => {
        setRawHTML(note.content);
    }, [note.content])

    const handleEditorChange = (e) => {
        setEditorState(e);
        setRawHTML(draftToHtml(convertToRaw(e.getCurrentContent())));
    }

    return (
        <Editor
            editorState={editorState}
            onEditorStateChange={handleEditorChange}
            placeholder='Write something'
        />
    )
}
