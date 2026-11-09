import React, { useEffect, useRef,useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from 'editorjs-header-with-alignment';
import List from '@editorjs/list';
 import  Paragraph  from "@editorjs/paragraph";
import ImageTool from '@editorjs/image';
import "./editor.css"

const Editor = ({ data, id,open }) => {
    const ejInstance = useRef();
  const [few,setFew] = useState()
setTimeout(()=>{setFew(data)},100)
    useEffect(() => {
        if (ejInstance.current === null) {
            initEditor();
        }
        return () => {
            ejInstance?.current?.destroy();
            ejInstance.current = null;
           
        }
    }, [few]);
//console.log("ejInstance.current",ejInstance.current)
    const initEditor=()=>{
          console.log("blocks",data)
          const editor = new EditorJS({
              holder:id,
              logLevel: "ERROR",
              data:JSON.parse(few??null),
              readOnly:true,
              onReady:()=>{
                  ejInstance.current=editor;
              },
              autofocus:true,
              tools:{
                  header:{
                      class: Header,
                      config: {
                        placeholder: 'Enter a header',
                      }
                    },
                  list:{
                      class: List,
                      inlineToolbar: true,
                      config: {
                        defaultStyle: 'unordered'
                      }
                    },
                    paragraph:{
                      class: Paragraph,
                      inlineToolbar: true,
                    },
                    image: {
                      class: ImageTool,
                    }
              },
             
          })
      }
      console.log("ejInstance.current222",ejInstance.current)
    return (
        <div id={id} className='editorJs '></div>
    )
}

export default Editor;
