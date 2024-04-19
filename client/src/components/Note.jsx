import React, { useEffect, useMemo, useState } from "react";
import {
  EditorState,
  convertFromHTML,
  ContentState,
  convertToRaw,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html"; // Import hàm draftToHtml từ thư viện draftjs-to-html
import { useLoaderData, useSubmit, useLocation } from "react-router-dom";
import { debounce } from "@mui/material";

export default function Note() {
  const { note } = useLoaderData();

  const submit = useSubmit();
  const location = useLocation();

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    const blocksFromHTML = convertFromHTML(note.content);
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    setEditorState(EditorState.createWithContent(state));
  }, [note.id]);

  const [rawHTML, setRawHTML] = useState(note.content);

  useEffect(() => {
    debouncedMemorized(rawHTML, note, location.pathname);
  }, [rawHTML, location.pathname]);

  //   Sử dụng debounce để trì hoãn việc gửi yêu cầu lưu dữ liệu trong 1 giây sau khi người dùng kết thúc nhập
  const debouncedMemorized = useMemo(() => {
    return debounce((rawHTML, note, pathname) => {
      if (rawHTML === note.content) return;

      submit(
        { ...note, content: rawHTML },
        {
          method: "post",
          action: pathname,
        }
      );
    }, 1000);
  }, []);

  useEffect(() => {
    setRawHTML(note.content);
  }, [note.content]);

  console.log({ location });

  // Xử lý sự kiện thay đổi nội dung của trình soạn thảo
  const handleOnchange = (e) => {
    setEditorState(e);
    // Chuyển đổi nội dung từ trình soạn thảo sang HTML và cập nhật rawHTML
    setRawHTML(draftToHtml(convertToRaw(e.getCurrentContent())));
  };

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={handleOnchange}
      placeholder="Write something"
    />
  );
}
