import ReactQuill, { Quill } from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useMemo } from "react";
import { useUploadFilesMutation } from "@/app/redux/apis/uploadApiQ";
import { toast } from 'react-toastify';

interface TextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
    const [uploadFiles, uploadFilesStatus] = useUploadFilesMutation();

    function imageHandler(this: { quill: any }) {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        const loadingElement = document.createElement('div');
        loadingElement.innerText = 'Uploading...';
        document.body.appendChild(loadingElement);
        loadingElement.style.display = 'block';
        input.onchange = async () => {
            if (!input.files) return

            const file = input.files[0];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('documentType', 'NotificationEditorImage');

            try {
                const storedFileUrl = await toast
                    .promise(
                        uploadFiles(formData).unwrap(),
                        {
                            success: 'Image Uploaded Successfully.',
                            pending: 'Uploading image...',
                            error: 'Unable to upload image. Please try again.',
                        }
                    )
                const cursorPosition = this.quill.selection.cursor.selection.lastRange.index;
                this.quill.insertEmbed(cursorPosition, 'image', storedFileUrl.data);
                this.quill.formatText(cursorPosition, 1, 'width', '300px');
                this.quill.setSelection(cursorPosition + 1);
            }
            finally {
                loadingElement.style.display = 'none';
            }
        };
    };

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                    ['blockquote', 'code-block'],

                    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                    [{ 'direction': 'rtl' }],                         // text direction
                    [{ "image": 'image' }],
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                    [{ 'font': [] }],
                    [{ 'align': [] }],

                    ['clean']
                ],
                handlers: {
                    image: imageHandler,
                },
            },
        }),
        [],
    )

    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={(val) => onChange(val)}
            modules={modules}
            className='h-max'
            placeholder="Write Notification Message..."
        ></ReactQuill>
    );
};

export default TextEditor;
