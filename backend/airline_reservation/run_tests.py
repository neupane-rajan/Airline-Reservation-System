#!/usr/bin/env python
import os
import sys
import subprocess
import time

def start_django_server():
    """Start Django development server"""
    server_process = subprocess.Popen(
        ['python', 'manage.py', 'runserver'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True
    )
    
    # Wait for server to start
    time.sleep(3)
    return server_process

def run_test(test_script):
    print(f"\n{'='*50}")
    print(f"Running {test_script}")
    print(f"{'='*50}")
    
    result = subprocess.run(['python', test_script], capture_output=True, text=True)
    
    print("STDOUT:")
    print(result.stdout)
    
    if result.stderr:
        print("STDERR:")
        print(result.stderr)
    
    return result.returncode

def main():
    # Ensure we're in the project root
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    # Start Django server
    server_process = start_django_server()

    try:
        # List of test scripts
        test_scripts = [
            'tests/comprehensive_api_test.py',
            'tests/flight_search_test.py',
            'tests/booking_test.py',
            'tests/logout_test.py',
        ]

        # Run tests
        failed_tests = []
        for script in test_scripts:
            return_code = run_test(script)
            if return_code != 0:
                failed_tests.append(script)

        # Summary
        print("\n{'='*50}")
        print("Test Run Summary:")
        if failed_tests:
            print("Failed Tests:")
            for test in failed_tests:
                print(f"  - {test}")
            sys.exit(1)
        else:
            print("All tests passed successfully!")

    finally:
        # Terminate the server
        server_process.terminate()
        server_process.wait()

if __name__ == '__main__':
    main()