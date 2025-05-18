* **Don't create oversimplified components without explicit instructions.** Avoid simplifying code unless specifically requested.
* **Fix real problems; don't replace complex solutions with oversimplified ones.** Focus on concrete errors, not on generalizing issues.
* **Work with existing code – don't create alternatives.** Claude Code is meant to help develop and improve existing codebases.
* **Find the root cause – avoid workarounds.** Always seek the core of the problem.
* **Debug existing code – don't replace it.** Claude Code should help you locate and fix errors, not rewrite functional (even if faulty) code segments.
* **Check documentation before making changes.** Always refer to official documentation first.
* **Don't guess the structure – ask for the necessary context.** Ensure you have all the information you need.
* **Utilize provided information – don't ignore it.** Every piece of information you give Claude Code is important.
* **Respect technical and architectural constraints.** Be mindful of project specifics and limitations.
* **Don't suggest migrations without instruction.** Don't initiate changes in technology or libraries unless explicitly instructed.
* **Integrate with existing architecture – don't ignore it.** New solutions must fit the current system.
* **Respect design patterns – maintain consistency.** Adhere to established patterns for predictable and maintainable code.
* **Analyze the impact of changes on the entire system.** Consider how modifications will affect other parts of the application.
* **Design testable code.** Every solution should be easy to test.
* **Prefer pinpoint changes – avoid mass modifications.** Introduce changes in a controlled and minimal manner.
* **Fix the cause – not just the symptoms.** Focus on eliminating the source of the problem.
* **Test in context – not in isolation.** Ensure the solution works in the actual application environment.
* **Avoid unnecessary dependencies.** Don't add new, superfluous dependencies during debugging.
* **Analyze edge cases.** Make sure the fix works for all possible scenarios.
* **Maintain functionality during fixes.** The debugging process shouldn't introduce new bugs or break existing features.
* **Preserve public interfaces.** Internal changes shouldn't affect how others use the component.
* **Maintain backward compatibility.** Avoid changes that break existing functionality.
* **Avoid premature optimization.** Refactor only when justified (e.g., by improving readability or performance).
* **Verify performance.** If refactoring aims to improve performance, ensure it actually does.
* **Introduce meaningful improvements.** Refactoring should bring tangible benefits.
* **Maintain code style consistency.** New code should match the project's existing style.
* **Document facts – not assumptions.** Describe the actual behavior of the code.
* **Describe edge conditions.** Always include how the code behaves in extreme cases.
* **Test functionality – not implementation.** Tests should verify if a function works correctly, regardless of how it's implemented.
* **Design tests resilient to refactoring.** Tests should be stable and not require frequent changes.
* **Include negative tests.** Check how the code behaves with invalid inputs.
* **Ensure deterministic tests.** Tests should always produce the same result for the same inputs.