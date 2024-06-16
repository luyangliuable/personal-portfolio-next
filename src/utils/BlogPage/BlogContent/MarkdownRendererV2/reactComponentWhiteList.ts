import Image from "../../../../components/Image/Image";
import CodeBlock from "../../../../page/BlogPage/BlogContent/CodeBlock/CodeBlock";
import BlogNote from "../../../../page/BlogPage/BlogContent/BlogNote/BlogNote";
import BlogWarning from "../../../../page/BlogPage/BlogContent/BlogWarning/BlogWarning";

const reactComponentWhiteList: { [key: string]: any } = {
    'img': Image,
    'note': BlogNote,
    'warn': BlogWarning,
    'bbb': CodeBlock
}

export default reactComponentWhiteList;
