import Button from "../Button/Button";
import { cl } from "../Utility/LogicUtility";

export interface ITextInputWithCard {
    heading: string;
    text: string;
    placeholder: string;
    submitText: string;
    className: string;
}

const TextInputWithCard: React.FC<ITextInputWithCard> = ({
    heading,
    text,
    placeholder,
    submitText,
    className,
}) => {
    return (
        <div
            className={cl(
                "w-fit max-w-[100%] p-5 flex flex-col justify-center border-solid border-[1px] bg-[#eee] border-[#ddd] rounded-sm relative",
                className,
            )}
        >
            <div className="mb-4 flex flex-col gap-2">
                <h3 className="text-2xl">{heading}</h3>
                <p className="text-sm">{text}</p>
            </div>
            <div className="flex flex-row">
                <input
                    type="email"
                    required
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    placeholder={placeholder}
                    aria-label="Email address"
                    className="w-full max-w-[400px] h-[40px] rounded-tl-md rounded-bl-md px-4"
                />
                <Button to="" className="text-sm">
                    {submitText}
                </Button>
            </div>
        </div>
    );
};

export default TextInputWithCard;
