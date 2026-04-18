import Image from "next/image";

interface CartItemImageProps {
    name: string;
    image1: string;
    image2?: string | null;
}

export const CartItemImage = ({ name, image1, image2 }: CartItemImageProps) => {
    const isSalsa = name.toLowerCase().includes("salsa");

    return (
        <div className="w-24 h-24 min-w-24 bg-accent-yellow-40 rounded-[7.66px] relative">
            <Image
                src={image1}
                alt="Burger"
                width={67}
                height={105}
                className={
                    isSalsa
                        ? "absolute top-[5px] left-[3px] w-[118px] h-[85px] object-cover overflow-visible"
                        : `object-cover absolute ${image2 ? "left-[5px] top-[-5px]" : "top-[-5px] left-[15px]"}`
                }
            />
            {image2 && (
                <Image
                    src={image2}
                    alt="Domiburguer papitas"
                    width={57}
                    height={84}
                    className="object-cover absolute top-5 left-[41px]"
                />
            )}
        </div>
    );
};
