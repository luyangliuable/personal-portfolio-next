import Image from "../../../../components/Image/Image";
import CodeBlock from "../../../../pages/BlogPage/BlogContent/CodeBlock/CodeBlock";
import BlogNote from "../../../../pages/BlogPage/BlogContent/BlogNote/BlogNote";
import BlogWarning from "../../../../pages/BlogPage/BlogContent/BlogWarning/BlogWarning";

const reactComponentWhiteList: { [key: string]: any } = {
    'img': Image,
    'note': BlogNote,
    'warn': BlogWarning,
    'bbb': CodeBlock
}

export default reactComponentWhiteList;
