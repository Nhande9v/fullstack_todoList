import React from "react";

export const Footer = ({completedTaskCount= 0, activeTaskCount= 0}) => {
    return <>
        {completedTaskCount + activeTaskCount > 0 &&(
            <div className="text-center">
                <p className="text-sm text-muted-foreground">
                    {
                        completedTaskCount > 0 && (
                            <>
                              Great job! {completedTaskCount} tasks done.
                              {
                                activeTaskCount > 0 && ` Just ${activeTaskCount} tasks left. You 've got this !!!!`
                              }
                            </>
                        )
                    }
                    {completedTaskCount === 0 && activeTaskCount > 0 && (
                        <>You have {activeTaskCount} tasks to complete !!!</>
                    )}
                </p>
            </div>
        )}
    </>
};

export default Footer;