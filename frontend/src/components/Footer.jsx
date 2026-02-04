import React from "react";

export const Footer = ({completedTaskCount= 0, activeTaskCount= 0}) => {
    return <>
        {completedTaskCount + activeTaskCount > 0 &&(
            <div className="text-center">
                <p className="text-sm text-muted-foreground">
                    {
                        completedTaskCount > 0 && (
                            <>
                              Tuyệt vời! Bạn đã hoàn thành {completedTaskCount} việc
                              {
                                activeTaskCount > 0 && `, còn ${activeTaskCount} việc dang dở thôi nhé! Cố lên!!!!`
                              }
                            </>
                        )
                    }
                    {completedTaskCount === 0 && activeTaskCount > 0 && (
                        <>Hãy bắt đầu làm {activeTaskCount} nhiệm vụ nào!!!</>
                    )}
                </p>
            </div>
        )}
    </>
};

export default Footer;