const PaymentMethod = () => {
    return (
        <div className="flex flex-col gap-4 w-full">
            <h5 className="body-font font-bold">Método de pago</h5>

            <div className="flex flex-wrap justify-around gap-3 sm:gap-4 md:gap-5 w-full">
                {paymentMethods.map((method) => (
                    <label
                        key={method.id}
                        className={`cursor-pointer inline-flex flex-col items-start justify-center p-3 flex-[0_0_auto] rounded-[8px] transition-colors ${formData.paymentMethod === method.id
                            ? "bg-accent-yellow-10"
                            : "bg-[#FFFFFF]"
                            }`}
                    >
                        <input
                            type="radio"
                            name="paymentMethod"
                            id={method.id}
                            value={method.id}
                            checked={formData.paymentMethod === method.id}
                            onChange={handleChange}
                            className="hidden"
                        />

                        <div className="inline-flex items-center gap-4">
                            <div
                                className={`relative w-4 h-4 rounded-[10px] ${formData.paymentMethod === method.id
                                    ? "bg-primary-red-60"
                                    : "bg-[#FFFFFF] border-2 border-solid border-[#cccccc]"
                                    }`}
                            >
                                {formData.paymentMethod === method.id && (
                                    <div className="relative top-[calc(50.00%_-_3px)] left-[calc(50.00%_-_3px)] w-1.5 h-1.5 bg-[#FFFFFF] rounded-[10px]" />
                                )}
                            </div>
                            <div className="flex flex-col xl:flex-row xl:gap-2 items-center">
                                <method.icon className={method.iconClass} />

                                <div
                                    className={`w-fit font-normal text-xs text-center leading-[18px] whitespace-nowrap ${formData.paymentMethod === method.id
                                        ? "text-neutral-black-80"
                                        : "text-neutral-black-50"
                                        }`}
                                >
                                    {method.label}
                                </div>
                            </div>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default PaymentMethod;