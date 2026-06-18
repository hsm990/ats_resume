const steps = ["Personal Info", "Experience", "Education", "Skills", "Projects", "Languages", "Summary", "Finalize"];

const SectionNav = ({ activeStep, onStep }) => (
    <ul>
        {steps.map((label, i) => {
            const stepNum = i + 1;
            return (
                <li
                    key={stepNum}
                    className={activeStep === stepNum ? "active" : activeStep > stepNum ? "done" : ""}
                    onClick={() => onStep(stepNum)}
                >
                    {label}
                </li>
            );
        })}
    </ul>
);

export default SectionNav;
